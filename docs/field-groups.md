# Field Groups
* They belong to the model
* They are like virtual containers
* They can be repeaters or groups. A group is the same as a repeater just not "repeatable"
* Shown on the admin model page if the model has groups defined
* They are saved on the client-config after editing
* The fields in the group are just the varNames of the fields
* Editing a fields varName will not update the group. It should

* You can create/edit/delete a group
* They are saved on the client-config after editing to override defaults
* To assign fields you need the field selector component
* Just like on editable regions there's a group/repeater component to render the fields

# UI
* List models as we do now.
* On click show 2 tabs, one for fields and one for groups
