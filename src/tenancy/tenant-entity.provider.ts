import { DataSource } from "typeorm";
import { Provider } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";

const TENANT_ENTITY = 'TENANT_ENTITY';

export function createTenantEntityProvider(entities: Function[]): Provider[] {
  return entities.map((entity) => ({
    provide: getRepositoryToken(entity),
    useFactory: (dataSource: DataSource) => {
      const metadata = Reflect.getMetadata(TENANT_ENTITY, entity);
      return dataSource.getRepository(metadata || entity);
    },
    inject: [DataSource],
  }));
}