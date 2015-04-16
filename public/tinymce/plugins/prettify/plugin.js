/**
 * plugin.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 * @version 0.0.1
 */

tinymce.PluginManager.add('prettify', function(editor, url) {
    // Add a button that opens a window
    editor.addButton('prettify', {
        text: 'prettify',
        icon: false,
        onclick: function() {
            // Open window
            editor.windowManager.open({
                title: 'prettify plugin',
                body: [
                    {
                      type:'listbox',
                      name:'kind',
                      label:'code class',
                      values:[
                      {text:'JavaScript',value:'lang-js'},
                      {text:'Css',value:'lang-css'},
                      {text:'HTML',value:'lang-html'},
                      {text:'PHP',value:'lang-php'}
                      ]
                    },
                    {
                      type:'listbox',
                      name:'showline',
                      label:'show line number',
                      values:[
                      {text:'showline',value:'linenums'},
                      {text:'noshowline',value:''}
                      ]
                    },
                    {type: 'textbox',
                     name: 'prettify',
                    label: 'prettify',
                    multiline: true,
                    minWidth: editor.getParam('code_dialog_width', 600),
                    minHeight: editor.getParam('code_dialog_height', Math.min(tinymce.DOM.getViewPort().h - 200, 500)),
                    spellcheck: false,
                    style: 'direction: ltr; text-align: left'
                  }
                ],
                onsubmit: function(e) {
                    // Insert content when the window form is submitted
                    console.log(editor.contentWindow.document);
                    editor.insertContent('<pre class="prettyprint '+ e.data.kind +' '+ e.data.showline +'">' + e.data.prettify +'</pre>');
                }
            });
        }
    });

});