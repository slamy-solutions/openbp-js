import { NativeStub, Service as NativeService, Config as NativeConfig } from '@openbp/native'
import { SystemStub, Service as SystemService, Config as SystemConfig } from '@openbp/system'
import { ERPStub, Service as ERPService, Config as ERPConfig } from '@openbp/erp'

export interface InternalOpenBPStubConfig {
    system?: {
        services: Array<SystemService>,
        config?: SystemConfig
    },
    native?: {
        services: Array<NativeService>,
        config?: NativeConfig
    },
    erp?: {
        services: Array<ERPService>,
        config?: ERPConfig
    }
}

export class InternalOpenBPStub {
    public readonly native: NativeStub;
    public readonly system: SystemStub;
    public readonly erp: ERPStub;

    constructor(config: InternalOpenBPStubConfig) {
        this.system = new SystemStub(config.system?.services ?? [], config.system?.config);
        this.native = new NativeStub(config.native?.services ?? [], config.native?.config);
        this.erp = new ERPStub(config.erp?.services ?? [], config.erp?.config);
    }

    async connect(): Promise<void> {
        try {
            await this.system.connect();
            await this.native.connect();
            await this.erp.connect();
        } catch (err) {
            await this.close();
            throw err
        }
    }

    async close(): Promise<void> {
        this.erp.close();
        this.native.close();
        await this.system.close();
    }
}
