/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, app, window */

function isDefault(element)
{
    return element.defaultDiagram;
}

function _handleOpenChildDiagram()
{
    var selectedModels = app.selections.getSelectedModels();

    if(selectedModels.length == 0)
    {
        app.toast.warning("No items selected.");
        return;
    }
    else if(selectedModels.length > 1) {
        app.toast.warning("Select only one item.");
        return;
    }

    var element = app.selections.getSelected();    
    if (element)
    {
        var foundDiagrams = [];

        element.ownedElements.forEach(function(ele)
        {
            if (ele instanceof type.UMLDiagram ||
                ele instanceof type.ERDDiagram ||
                ele instanceof type.FCFlowchartDiagram ||
                ele instanceof type.DFDDiagram)
            {
                foundDiagrams.push(ele);
            }
            else if(ele.ownedElements)
            {
                ele.ownedElements.forEach(function(innerEle)
                {
                    if (innerEle instanceof type.UMLDiagram ||
                        innerEle instanceof type.ERDDiagram ||
                        innerEle instanceof type.FCFlowchartDiagram ||
                        innerEle instanceof type.DFDDiagram)
                    {
                        foundDiagrams.push(innerEle);
                    }
                });
            }
        });

        OpenDiagramFrom(foundDiagrams)
    }
    else
    {
        app.toast.warning("Nothing selected.");
    }
}

function _handleOpenParentDiagram()
{
	var diagMgr = app.diagrams;
	var currDiag = diagMgr.getCurrentDiagram();
	if (currDiag == null)
		return;
	
	var upperElem = currDiag._parent;
	if (upperElem == null)
		return;

	var prevUpperElem = currDiag._parent;
	upperElem = upperElem._parent;
	var foundDiags = [];

	while (upperElem != null)
	{
		for (var cElem of upperElem.getChildNodes(false))
		{
			if (cElem instanceof app.type["Diagram"])
				foundDiags.push(cElem);
		}
		if (foundDiags.length != 0)
			break;

        foundDiags.splice(0);
		prevUpperElem = upperElem;
		upperElem = upperElem._parent;
	}

    OpenDiagramFrom(foundDiags);
}

function OpenDiagramFrom(foundDiagrams)
{
    if (foundDiagrams.length < 1)
    {
        app.toast.error("No diagram found.");
    }
    else
    {
        var defaultDiagrams = foundDiagrams.filter(isDefault);

        var openDiagram = function(diagram)
        {
            if (diagram)
            {
                app.modelExplorer.select(diagram, true)
                app.diagrams.setCurrentDiagram(diagram, false);
            }
        }

        if (defaultDiagrams.length == 1)
            openDiagram(defaultDiagrams[0]);
        else if(foundDiagrams.length == 1)
            openDiagram(foundDiagrams[0]);
        else
        {
            var dlg = app
                .elementListPickerDialog
                .showDialog("Select a diagram to open", foundDiagrams)
                .then(function ({buttonId, returnValue})
            {
                if (buttonId === 'ok')
                    openDiagram(returnValue);
            });
        }

    }
}

/** Initialize Extension */
function init()
{
    var CMD_OPEN_CHILD_DIAGRAM = "linked_diagram_navigator:open_child_diagram";
    var CMD_OPEN_PARENT_DIAGRAM = "linked_diagram_navigator:open_parent_diagram";
    app.commands.register(CMD_OPEN_CHILD_DIAGRAM, _handleOpenChildDiagram);
    app.commands.register(CMD_OPEN_PARENT_DIAGRAM, _handleOpenParentDiagram);
}

exports.init = init;