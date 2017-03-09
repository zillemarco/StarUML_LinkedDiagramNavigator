/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, app, window */

define(function (require, exports, module) {
    "use strict";

    var Repository          = app.getModule("core/Repository"),
        DiagramManager      = app.getModule('diagrams/DiagramManager'),
        SelectionManager    = app.getModule("engine/SelectionManager"),
        ModelExplorerView   = app.getModule('explorer/ModelExplorerView'),
        CommandManager      = app.getModule("command/CommandManager"),
        DefaultMenus        = app.getModule("menu/DefaultMenus"),
        ContextMenuManager  = app.getModule("menu/ContextMenuManager"),
        Toast               = app.getModule("ui/Toast");

    function _handleOpenLinkedDiagram()
    {
        if(SelectionManager.getSelectedModels().length > 1)
        {
            Toast.warning("Select only one item.");
            return;
        }

        var element = SelectionManager.getSelected();
        
        if (element)
        {
            var foundView = false;
            for(var ownedElementIndex = 0; ownedElementIndex < element.ownedElements.length; ownedElementIndex++)
            {
                var ownedElement = element.ownedElements[ownedElementIndex];

                if(ownedElement instanceof type.UMLDiagram)
                {
                    var view = ownedElement.ownedViews[0];

                    if(view)
                    {
                        foundView = true;
                        DiagramManager.selectInDiagram(view);
                        ModelExplorerView.select(ownedElement.ownedElements[0], true);
                        break;
                    }
                }
                else if(ownedElement.ownedElements.length == 1)
                {
                    if(ownedElement.ownedElements[0] instanceof type.UMLDiagram)
                    {
                        var view = ownedElement.ownedElements[0].ownedViews[0];

                        if(view)
                        {
                            foundView = true;
                            DiagramManager.selectInDiagram(view);
                            ModelExplorerView.select(ownedElement.ownedElements[0], true);
                            break;
                        }
                    }
                }
            }

            if(!foundView)
            {
                Toast.error("No linked diagram.");
            }
        }
        else
        {
            Toast.warning("Nothing selected.");
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