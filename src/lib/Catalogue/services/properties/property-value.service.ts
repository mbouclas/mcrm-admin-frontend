import {BaseHttpService} from "../../../Shared/base-http.service";
import type {IGenericObject} from "../../../Shared/models/generic";

export class PropertyValueService extends BaseHttpService {
    async update(id: string, data: IGenericObject) {
        return await this.patch(`property-value/${id}`, data, {
            successMessage: 'Updated successfully',
            errorMessage: 'Failed to update',
        });
    }

    async store(data: IGenericObject, propertyId: string) {
        return await super.post(
            'property-value',
            { ...data, active: true, propertyId },
            {
                successMessage: 'Created successfully',
                errorMessage: 'Failed to created',
            },
        );
    }
}
