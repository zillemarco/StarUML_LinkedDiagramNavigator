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

    function isDefault(element) {
        return element.defaultDiagram;
    }
    
    function _handleOpenLinkedDiagram()
    {
        if(SelectionManager.getSelectedModels().length > 1) {
            Toast.warning("Select only one item.");
            return;
        }

        var element = SelectionManager.getSelected();
        
        if (element) {
            var foundDiagrams = [];

            element.ownedElements.forEach(function(ele) {
                if (ele instanceof type.UMLDiagram) {
                    foundDiagrams.push(ele);
                } else {
                    ele.ownedElements.forEach(function(innerEle) {
                        if (innerEle instanceof type.UMLDiagram) {
                            foundDiagrams.push(innerEle);
                        }
                    });
                }
            });

            if (foundDiagrams.length < 1) {
                Toast.error("No linked diagram found.");
            } else {
                var diagram,
                    defaultDiagrams = foundDiagrams.filter(isDefault);

                // if no default diagram is set use normal diagram
                if (defaultDiagrams.length < 1) {
                    if (foundDiagrams.length > 1) {
                        Toast.error("Multiple linked diagrams found. Please set one as default.");
                    } else {
                        diagram = foundDiagrams[0];
                    }
                } else {
                    if (defaultDiagrams.length > 1) {
                        Toast.error("Multiple linked diagrams found that are set as default.");
                    } else {
                        diagram = defaultDiagrams[0];
                    }
                }

                if (diagram) {
                    var view = diagram.ownedViews[0];
                    if(view) {
                        DiagramManager.selectInDiagram(view);
                        ModelExplorerView.select(diagram, true);
                    } else {
                        Toast.error("No linked diagram with view found.");
                    }
                }
            }
        } else {
            Toast.warning("Nothing selected.");
        }
    }

    /**
     * Initialize Extension
     */
    function init() {
        var CMD_OPEN_LINKED_DIAGRAM = "linkedDiagramNavigator.openLinkedDiagram";

        CommandManager.register("Open linked diagram", CMD_OPEN_LINKED_DIAGRAM, _handleOpenLinkedDiagram);

        var contextMenu = ContextMenuManager.getContextMenu(DefaultMenus.contextMenus.DIAGRAM);

        contextMenu.addMenuDivider();
        contextMenu.addMenuItem(CMD_OPEN_LINKED_DIAGRAM);
    }

    // Initialize Extension
    init();
});
