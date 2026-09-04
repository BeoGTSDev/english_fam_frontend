import { describe, expect, it } from 'vitest'
import { curriculumApi } from '../api/curriculum.api'

describe('curriculumApi', () => {
  it('returns canonical MOET 2018 curriculum metadata', async () => {
    const curriculum = await curriculumApi.getCurriculum()
    expect(curriculum.curriculum_code).toBe('MOET-GDPT-2018')
    expect(curriculum.authority_name).toContain('Ministry of Education')
  })

  it('returns version list with statutory baseline and draft', async () => {
    const versions = await curriculumApi.getVersions()
    expect(versions.length).toBeGreaterThanOrEqual(2)
    const approvedVer = versions.find((v) => v.status === 'APPROVED')
    expect(approvedVer).toBeDefined()
    expect(approvedVer?.document_reference).toContain('Thông tư 13/2022')
  })

  it('validates a curriculum version structure', async () => {
    const res = await curriculumApi.validateVersion('ver-2022-v2')
    expect(res.valid).toBe(true)
  })

  it('creates a draft version that preserves historical lineage', async () => {
    const newVersion = await curriculumApi.createVersion({
      curriculum_id: 'curr-moet-gdpt',
      source_version_id: 'SRC-TEST-2026',
      version_label: 'v2.3-Test',
      document_reference: 'Thông tư thử nghiệm',
      effective_from: '2026-09-05',
      supersedes_version_id: 'ver-2022-v2',
      change_reason: 'Testing version immutability and lineage preservation',
    })

    expect(newVersion.status).toBe('DRAFT')
    expect(newVersion.supersedes_version_id).toBe('ver-2022-v2')
    expect(newVersion.version_label).toBe('v2.3-Test')
  })
})
