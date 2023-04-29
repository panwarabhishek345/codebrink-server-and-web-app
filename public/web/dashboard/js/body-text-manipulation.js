function breakText() {
    editor.session.insert(editor.getCursorPosition(), "<br>");
    editor.focus();
}

function horizontalRuleText() {
    editor.session.insert(editor.getCursorPosition(), "<hr>");
    editor.focus();
}


function tableText() {
    editor.session.insert(editor.getCursorPosition(), "<table id=\"table-normal\">\n<tbody>\n<tr>\n\t<th></th>\n\t<th></th>\n</tr>\n<tr>\n\t<td></td>\n\t<td></td>\n</tr>\n</tbody>\n</table>");
    editor.focus();
}

function h2Text() {
    editor.session.replace(editor.selection.getRange(), "<h2>" + editor.getSelectedText() + "</h2>");
    editor.focus(); //To focus the ace editor
}

function h3Text() {
    editor.session.replace(editor.selection.getRange(), "<h3>" + editor.getSelectedText() + "</h3>");
    editor.focus();
}

function h4Text() {
    editor.session.replace(editor.selection.getRange(), "<h4>" + editor.getSelectedText() + "</h4>");
    editor.focus();
}

function h5Text() {
    editor.session.replace(editor.selection.getRange(), "<h5>" + editor.getSelectedText() + "</h5>");
    editor.focus();
}

function highlightText() {
    editor.session.replace(editor.selection.getRange(), "<span class=\"highlighted-text\">" + editor.getSelectedText() + "</span>");
    editor.focus();
}

function boldText() {
    editor.session.replace(editor.selection.getRange(), "<b>" + editor.getSelectedText() + "</b>");
    editor.focus(); //To focus the ace editor
}

function italicText() {
    editor.session.replace(editor.selection.getRange(), "<i>" + editor.getSelectedText() + "</i>");
    editor.focus();

}

function underlineText() {
    editor.session.replace(editor.selection.getRange(), "<u>" + editor.getSelectedText() + "</u>");
    editor.focus();

}

function codeText() {
    editor.session.replace(editor.selection.getRange(), "<code class=\"inline-code\">" + editor.getSelectedText() + "</code>");
    editor.focus();
}

function olText() {
    editor.session.replace(editor.selection.getRange(), "<ol>" + editor.getSelectedText() + "</ol>");
    editor.focus();
}

function ulText() {
    editor.session.replace(editor.selection.getRange(), "<ul>" + editor.getSelectedText() + "</ul>");
    editor.focus();
}

function liText() {
    editor.session.replace(editor.selection.getRange(), "<li>" + editor.getSelectedText() + "</li>");
    editor.focus();
}

function lessThanText() {
    editor.session.insert(editor.getCursorPosition(), "&lt;");
    editor.focus();
}

function greaterThanText() {
    editor.session.insert(editor.getCursorPosition(), "&gt;");
    editor.focus();
}

function addImage() {
    var iMOString = "<div class=\"media-object\" type=\"image\" src=\"\"></div>";
    editor.session.insert(editor.getCursorPosition(), iMOString);
    editor.focus();
}

function addCode() {
    var cMOString = "<xmp class=\"media-object\" type=\"code\" language=\"\" full-screen-enable=\"\">\n // You code goes here. \n</xmp>";
    editor.session.insert(editor.getCursorPosition(), cMOString);
    editor.focus();
}

function addWeb() {
    var wMOString = "<xmp class=\"media-object\" type=\"web\" full-screen-enable=\"\">\n// Your html goes here.\n</xmp>";
    editor.session.insert(editor.getCursorPosition(), wMOString);
    editor.focus();
}

function addPreText() {
    var ptMOString = "<xmp class=\"media-object\" type=\"pre-text\" full-screen-enable=\"\">\n// Your text goes here.\n</xmp>";
    editor.session.insert(editor.getCursorPosition(), ptMOString);
    editor.focus();
}


function toggleFullScreen() {
    editor.container.requestFullscreen();
}