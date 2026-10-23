import { useCallback, useEffect, useRef, useState } from 'react'
import { AppError } from '../../../shared/errors/app-error'
import type { AuthorizedApiRequest } from '../../../shared/api/api-client'
import { createAssessmentApi } from '../api/assessment-api'
import type {
  AssessmentItem,
  AssessmentResult,
  AssessmentReview,
  BrowserEventType,
  CurrentAssessment,
  ReviewQueueItem,
} from '../assessment.types'
type Api = ReturnType<typeof createAssessmentApi>
type Commit = (update: () => void) => void
type PendingAnswer = { item: string; option: string; key: string }
export function useAssessmentController(request: AuthorizedApiRequest) {
  const [current, setCurrent] = useState<CurrentAssessment>({
    session_id: null,
  })
  const [item, setItem] = useState<AssessmentItem | null>(null)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('')
  const [pending, setPending] = useState<PendingAnswer | null>(null)
  const [active, setActive] = useState(false)
  const [clock, setClock] = useState<{
    duration: number
    anchor: number
  } | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const generation = useRef(0),
    refreshEvidence = useRef(false),
    controller = useRef<AbortController | null>(null),
    working = useRef(false)
  const answerRef = useRef<PendingAnswer | null>(null),
    startRef = useRef<{ key: string; retest?: string } | null>(null)
  const finishRef = useRef<{ id: string; key: string } | null>(null),
    timeoutSent = useRef(false),
    lastDeparture = useRef(-Infinity)
  const finishKey = useCallback((id: string) => {
    if (finishRef.current?.id !== id)
      finishRef.current = { id, key: crypto.randomUUID() }
    return finishRef.current.key
  }, [])
  const showResult = useCallback(
    (value: AssessmentResult, commit: Commit) =>
      commit(() => {
        setResult(value)
        setCurrent({ session_id: value.session_id, status: value.status })
        setItem(null)
        setClock(null)
        setRemaining(null)
        setActive(false)
        setPending(null)
        answerRef.current = null
      }),
    [],
  )
  const load = useCallback(
    async (api: Api, id: string, commit: Commit) => {
      const next = await api.next(id)
      if ('complete' in next) {
        showResult(await api.result(id), commit)
        return false
      }
      commit(() => {
        setItem(next)
        setResult(null)
        setActive(true)
        setClock({
          duration: Math.max(
            0,
            Date.parse(next.expires_at) - Date.parse(next.server_time),
          ),
          anchor: performance.now(),
        })
        timeoutSent.current = false
        if (answerRef.current?.item !== next.exam_question_id) {
          answerRef.current = null
          setPending(null)
        }
      })
      return true
    },
    [showResult],
  )
  const run = useCallback(
    async (work: (api: Api, commit: Commit) => Promise<void>) => {
      const abort = controller.current
      if (!abort || abort.signal.aborted || working.current) return
      working.current = true
      setBusy(true)
      setError('')
      const revision = generation.current
      const commit: Commit = (update) => {
        if (generation.current === revision && !abort.signal.aborted) update()
      }
      try {
        await work(createAssessmentApi(request, abort.signal), commit)
      } catch (cause) {
        commit(() =>
          setError(cause instanceof AppError ? cause.kind : 'unknown'),
        )
      } finally {
        commit(() => {
          working.current = false
          setBusy(false)
        })
      }
    },
    [request],
  )
  useEffect(() => {
    const abort = new AbortController()
    controller.current = abort
    generation.current++
    working.current = false
    void run(async (api, commit) => {
      const session = await api.current()
      commit(() => {
        setCurrent(session)
        refreshEvidence.current =
          session.status === 'ACTIVE' || session.status === 'CREATED'
      })
      if (
        session.session_id &&
        session.status &&
        !['ACTIVE', 'CREATED', 'SUBMITTED', 'PAUSED'].includes(session.status)
      )
        showResult(await api.result(session.session_id), commit)
    })
    return () => {
      generation.current++
      abort.abort()
      working.current = false
    }
  }, [run, showResult])
  const start = useCallback(
    () =>
      run(async (api, commit) => {
        const retest =
          current.status === 'RETEST_REQUIRED'
            ? (current.session_id ?? undefined)
            : undefined
        if (!startRef.current || startRef.current.retest !== retest)
          startRef.current = { key: crypto.randomUUID(), retest }
        const session = await api.start(startRef.current.key, retest)
        if (!session.session_id)
          throw new AppError('unknown', 'The assessment could not be started.')
        commit(() => {
          setCurrent(session)
          setActive(true)
        })
        await load(api, session.session_id, commit)
      }),
    [current, load, run],
  )
  const resume = useCallback(
    () =>
      run(async (api, commit) => {
        if (!current.session_id) return
        const resumed = await load(api, current.session_id, commit)
        if (resumed && refreshEvidence.current) {
          refreshEvidence.current = false
          await api
            .event(current.session_id, 'SESSION_REFRESH', crypto.randomUUID())
            .catch(() => {})
        }
      }),
    [current.session_id, load, run],
  )
  const submit = useCallback(
    (option: string) =>
      run(async (api, commit) => {
        if (!item || !current.session_id) return
        const payload = answerRef.current ?? {
          item: item.exam_question_id,
          option,
          key: crypto.randomUUID(),
        }
        answerRef.current = payload
        commit(() => setPending(payload))
        const accepted = await api.answer(
          current.session_id,
          payload.item,
          payload.option,
          payload.key,
        )
        commit(() => {
          answerRef.current = null
          setPending(null)
          setItem(null)
        })
        if (accepted.session_status === 'SUBMITTED')
          showResult(
            await api.finish(current.session_id, finishKey(current.session_id)),
            commit,
          )
        else await load(api, current.session_id, commit)
      }),
    [current.session_id, finishKey, item, load, run, showResult],
  )
  const finish = useCallback(
    () =>
      run(async (api, commit) => {
        if (current.session_id)
          showResult(
            await api.finish(current.session_id, finishKey(current.session_id)),
            commit,
          )
      }),
    [current.session_id, finishKey, run, showResult],
  )
  useEffect(() => {
    if (!clock) return
    const update = () =>
      setRemaining(
        Math.max(
          0,
          Math.ceil(
            (clock.duration - (performance.now() - clock.anchor)) / 1000,
          ),
        ),
      )
    update()
    const interval = window.setInterval(update, 1000)
    return () => window.clearInterval(interval)
  }, [clock])
  useEffect(() => {
    if (clock && remaining === 0 && !busy && !timeoutSent.current) {
      timeoutSent.current = true
      void finish()
    }
  }, [busy, clock, finish, remaining])
  const recordEvent = useCallback(
    (type: BrowserEventType) => {
      const abort = controller.current
      if (!active || !current.session_id || !abort || abort.signal.aborted)
        return
      if (type === 'WINDOW_DEPARTURE') {
        if (performance.now() - lastDeparture.current < 2000) return
        lastDeparture.current = performance.now()
      }
      const api = createAssessmentApi(request, abort.signal),
        key = crypto.randomUUID(),
        time = new Date().toISOString(),
        id = current.session_id
      const send = () =>
        api.event(
          id,
          type,
          key,
          type === 'FULLSCREEN_EXIT' ? document.fullscreenEnabled : undefined,
          time,
        )
      void send()
        .catch(async (cause) => {
          if (
            cause instanceof AppError &&
            cause.kind === 'retryable-dependency' &&
            !abort.signal.aborted
          )
            await send()
        })
        .catch(() => {})
    },
    [active, current.session_id, request],
  )
  useEffect(() => {
    if (!active) return
    const hidden = () => {
      if (document.visibilityState === 'hidden') recordEvent('WINDOW_DEPARTURE')
    }
    const blur = () => recordEvent('WINDOW_DEPARTURE')
    const fullscreen = () => {
      if (document.fullscreenEnabled && !document.fullscreenElement)
        recordEvent('FULLSCREEN_EXIT')
    }
    document.addEventListener('visibilitychange', hidden)
    window.addEventListener('blur', blur)
    document.addEventListener('fullscreenchange', fullscreen)
    return () => {
      document.removeEventListener('visibilitychange', hidden)
      window.removeEventListener('blur', blur)
      document.removeEventListener('fullscreenchange', fullscreen)
    }
  }, [active, recordEvent])
  return {
    current,
    item,
    result,
    busy,
    error,
    pending,
    remaining,
    start,
    resume,
    submit,
    finish,
    recordEvent,
  }
}
export function useAssessmentReviewController(request: AuthorizedApiRequest) {
  const [items, setItems] = useState<ReviewQueueItem[]>([]),
    [cursor, setCursor] = useState<string | null>(null)
  const [detail, setDetail] = useState<AssessmentReview | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('')
  const [pending, setPending] = useState<{
    id: string
    action: 'verify' | 'invalidate' | 'authorize-retest'
    reason: string
    key: string
  } | null>(null)
  const controller = useRef<AbortController | null>(null),
    generation = useRef(0),
    working = useRef(false)
  const pendingRef = useRef<typeof pending>(null)
  const run = useCallback(
    async (work: (api: Api, commit: Commit) => Promise<void>) => {
      const abort = controller.current
      if (!abort || abort.signal.aborted || working.current) return
      working.current = true
      setBusy(true)
      setError('')
      const revision = generation.current
      const commit: Commit = (update) => {
        if (revision === generation.current && !abort.signal.aborted) update()
      }
      try {
        await work(createAssessmentApi(request, abort.signal), commit)
      } catch (cause) {
        commit(() =>
          setError(cause instanceof AppError ? cause.kind : 'unknown'),
        )
      } finally {
        commit(() => {
          working.current = false
          setBusy(false)
        })
      }
    },
    [request],
  )
  const refresh = useCallback(
    () =>
      run(async (api, commit) => {
        const queue = await api.queue()
        commit(() => {
          setItems(queue.items)
          setCursor(queue.next_cursor)
        })
      }),
    [run],
  )
  useEffect(() => {
    const abort = new AbortController()
    controller.current = abort
    generation.current++
    working.current = false
    void refresh()
    return () => {
      generation.current++
      abort.abort()
      working.current = false
    }
  }, [refresh])
  const more = () =>
    run(async (api, commit) => {
      if (!cursor) return
      const queue = await api.queue(cursor)
      commit(() => {
        setItems((previous) => [
          ...previous,
          ...queue.items.filter(
            (i) => !previous.some((p) => p.session_id === i.session_id),
          ),
        ])
        setCursor(queue.next_cursor)
      })
    })
  const open = (id: string) =>
    run(async (api, commit) => {
      const value = await api.detail(id)
      commit(() => {
        setDetail(value)
        pendingRef.current = null
        setPending(null)
      })
    })
  const review = (
    action: 'verify' | 'invalidate' | 'authorize-retest',
    reason: string,
  ) =>
    run(async (api, commit) => {
      if (!detail) return
      const command = pendingRef.current ?? {
        id: detail.session_id,
        action,
        reason,
        key: crypto.randomUUID(),
      }
      pendingRef.current = command
      commit(() => setPending(command))
      let response: AssessmentResult
      try {
        response = await api.review(
          command.id,
          command.action,
          command.reason,
          command.key,
        )
      } catch (cause) {
        if (
          cause instanceof AppError &&
          ['conflict', 'validation', 'forbidden', 'not-found'].includes(
            cause.kind,
          )
        )
          commit(() => {
            pendingRef.current = null
            setPending(null)
          })
        throw cause
      }
      commit(() => {
        setDetail((previous) =>
          previous ? { ...previous, ...response } : null,
        )
        setItems((previous) =>
          previous.filter((i) => i.session_id !== command.id),
        )
        pendingRef.current = null
        setPending(null)
      })
      const reviewed = await api.detail(command.id)
      commit(() => setDetail(reviewed))
    })
  return {
    items,
    cursor,
    detail,
    busy,
    error,
    pending,
    refresh,
    more,
    open,
    review,
  }
}
