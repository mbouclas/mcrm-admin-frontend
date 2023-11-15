import {BaseHttpService} from "../Shared/base-http.service";
import type {MenuItemModel, MenuModel} from "./models";
import type {IGenericObject, TreeDeleteType} from "../Shared/models/generic";

export class MenuService extends BaseHttpService {
    async getMenus() {
        return await this.get('menu');
    }

    async getMenu(id: string): Promise<MenuModel> {
        return await this.get(`menu/${id}`);
    }

    async createMenu(data: Partial<MenuModel>): Promise<MenuModel> {
        return await this.post('menu', data, {successMessage: 'Menu created successfully', errorMessage: 'Failed to create menu'});
    }

    async updateMenu(menuId: string, model: Partial<MenuModel>) {
        return await this.patch(`menu/${menuId}`, model,
            {successMessage: 'Menu updated successfully', errorMessage: 'Failed to update menu'});
    }

    async deleteMenu(menuId: string) {
        return await this.delete(`menu/${menuId}`, {successMessage: 'Menu deleted successfully', errorMessage: 'Failed to delete menu'});
    }

    async getMenuItems(menuId: string) {
        return await this.get(`menu-item/tree?menuId=${menuId}`);
    }

    async getMenuItem(id: string) {
        return await this.get(`menu-item/${id}`);
    }

    async createMenuItem(menuId: string, model: Partial<MenuItemModel>) {
        return await this.post('menu-item', {item: model, menuId}, {successMessage: 'Menu item created successfully', errorMessage: 'Failed to create menu item'});
    }

    async updateMenuItem(id: string, model: Partial<MenuItemModel>) {
        return await this.patch(`menu-item/${id}`, model,
            {successMessage: 'Menu item updated successfully', errorMessage: 'Failed to update menu item'});
    }

    async deleteMenuItem(menuId: string, id: string, deleteType: TreeDeleteType) {
        return await this.delete(`menu-item/${id}?deleteType=${deleteType}&menuId=${menuId}`, {successMessage: 'Menu item deleted successfully', errorMessage: 'Failed to delete menu item'});
    }

    async move(uuid: string, newParentUuid: string, menuId: string) {
        const body = newParentUuid ? { newParentUuid } : {};

        return await this.patch(`menu-item/${uuid}/move?menuId=${menuId}`, body, {
            successMessage: 'Moved successfully',
            errorMessage: 'Failed to move category',
        });
    }

    async makePermalink(model: string, data: IGenericObject) {
        return await this.post(`menu/make-permalink`, {model, data});
    }

    async toMenuItem(modelName: string, data: IGenericObject) {
        return await this.post(`menu-item/to-menu-item/${modelName}`, data);
    }

    async saveOrder(items: Partial<MenuItemModel>[]) {
        return await this.patch(`menu-item/save-order`, items, {
            successMessage: 'Order saved successfully',
            errorMessage: 'Failed to save order',
        });
    }

    async addMenuItemChildren(menuId: string, item: MenuItemModel, modelName: string) {
        return await this.post(`menu-item/add-children`, {menuId, item, modelName}, {
            successMessage: 'Menu item children added successfully',
            errorMessage: 'Failed to add menu item children',
        });
    }
}
