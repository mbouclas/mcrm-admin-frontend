import type {IBaseModel} from "../DynamicFields/base-model";
import type {IAppState} from "../stores";
import type {IGates} from "../Auth/auth.service";

export class AppService {
    public static models: IBaseModel[] = [];
    public static gates: IGates[] = [];

    public static updateAppState(state: IAppState) {
        this.models = state.models;
        this.gates = state.gates;
    }

    public static getModel(name: string) {
        if (name.indexOf('Model') === -1) {
            name = `${name}Model`;
        }

        return this.models.find(model => model.name === name);
    }

    public static getAvailableModels() {
        return this.models;
    }
}
