// backend/src/tenancy/tenant-aware-repository.decorator.ts
import { SetMetadata } from "@nestjs/common";
import { Repository } from "typeorm";
import { Patient } from "src/entities/patient.entity";
// Update the import path below to the actual location of patient.entity.ts

export const TENANT_ENTITY = "TENANT_ENTITY";

export function TenantAwareRepository(entity: Function) {
  return SetMetadata(TENANT_ENTITY, entity);
}

// Usage:
@TenantAwareRepository(Patient)
export class PatientRepository extends Repository<Patient> {}