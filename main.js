/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, app, window */

define(function (require, exports, module) {
    "use strict";

    var Repository          = app.getModule("core/Repository"),
        DiagramManager      = app.getModule('diagrams/DiagramManager'),
        SelectionManager    = app.getModule("engine/SelectionManager"),
        CommandManager      = app.getModule("command/CommandManager"),
        DefaultMenus        = app.getModule("menu/DefaultMenus"),
        ContextMenuManager  = app.getModule("menu/ContextMenuManager"),
        Toast               = app.getModule("ui/Toast");

    function _handleOpenLinkedDiagram()
    {
        var element = SelectionManager.getSelected();
        
        if (element)
        {
            if(element.ownedElements.length == 1)
            {
                var ownedElement = element.ownedElements[0];

                if(ownedElement.ownedElements.length == 1)
                {
                    if(ownedElement.ownedElements[0] instanceof type.UMLDiagram)
                    {
                        var view = ownedElement.ownedElements[0].ownedViews[0];

                        if(view)
                        {
                            DiagramManager.selectInDiagram(view);
                        }
                        else
                        {
                            Toast.info("No linked diagram.");
                        }
                    }
                    else
                    {
                        Toast.info("No linked diagram.");
                    }
                }
                else
                {
                    Toast.info("No linked diagram.");
                }
            }
            else
            {
                Toast.info("No linked diagram.");
            }
        }
        else
        {
            Toast.info("Nothing selected.");
        }
    }

    /**
     * Initialize Extension
     */
    function init()
    {
        var CMD_OPEN_LINKED_DIAGRAM = "linkedDiagramNavigator.openLinkedDiagram";

        CommandManager.register("Open linked diagram", CMD_OPEN_LINKED_DIAGRAM, _handleOpenLinkedDiagram);

        var contextMenu = ContextMenuManager.getContextMenu(DefaultMenus.contextMenus.DIAGRAM);

        contextMenu.addMenuDivider();
        contextMenu.addMenuItem(CMD_OPEN_LINKED_DIAGRAM);
    }

    // Initialize Extension
    init();
});