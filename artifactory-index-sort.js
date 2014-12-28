// ==UserScript==
// @name       Ivy Date Sort
// @author     Jacob Meacham
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description Sort ivy pages by date
// @match      http://artifactory*
// @copyright  MIT Licensed
// @require http://code.jquery.com/jquery-latest.js
// @require http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js
// @require http://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.17.5/js/jquery.tablesorter.min.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('table.tablesorter { font-family:arial; background-color: #CDCDCD; margin:10px 0pt 15px; width: 40%; text-align: left; }');
addGlobalStyle('table.tablesorter thead tr th, table.tablesorter tfoot tr th { background-color: #e6EEEE; border: 1px solid #FFF; padding: 4px; }');
addGlobalStyle('table.tablesorter thead tr .header { cursor: pointer; }');
addGlobalStyle('table.tablesorter tbody td { color: #3D3D3D; padding: 4px; background-color: #FFF; vertical-align: top; }');
addGlobalStyle('table.tablesorter tbody tr.odd td { background-color:#F0F0F6; }');
addGlobalStyle('table.tablesorter thead tr .tablesorter-headerDesc, table.tablesorter thead tr .tablesorter-headerAsc { background-color: #8dbdd8; }');

$("pre:eq(0)").remove();
$("hr:eq(0)").remove();

//--- Get the table we want to sort.
var artifactParent = $("pre:eq(0)");
if (artifactParent === undefined) {
    return;
}

var stringArtifacts = artifactParent.text().split("\n");
var artifacts = [];
for (var i = 1; i < stringArtifacts.length; i++) { // skip the ../ element
    var props = stringArtifacts[i].split("  ");
    props = _.without(props, "");
    if (props.length < 3) {
        continue;
    }
    var artifactObject = {'url':props[0].trim(), 'name':props[0], 'date':props[1], 'size':props[2]};
    artifacts.push(artifactObject);
}

var replacementHtml = "<a href='../'>../</a>\n";
replacementHtml += "<table id='artifactTable'  cellspacing='1' class='tablesorter'> \
<thead> \
<tr> \
    <th>Name</th> \
    <th>Last Modified</th> \
    <th>Size</th> \
</tr> \
</thead> \
<tbody>";

for (var i = 0; i < artifacts.length; i++) {
    replacementHtml += "<tr>";
    replacementHtml += "<td><a href='" + artifacts[i].url + "'>" + artifacts[i].name + "</a></td>" + "<td>" + artifacts[i].date + "</td> <td>" + artifacts[i].size + "</td>";
    replacementHtml += "</tr>";
}

replacementHtml += "</td>";
artifactParent.html(replacementHtml);

$("#artifactTable").tablesorter({
    theme : 'blue',
    dateFormat : "dd-mm-yyyy hh:mm", // set the default date format   
    
    sortList: [[1,1]],
    
    headers: {
      1: { sorter: "shortDate" } //, dateFormat will parsed as the default above
    }
 });