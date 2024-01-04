'use strict';

/* use hexo-generator-i18n package to generate Multi-languages, without replacing url_for() to url_for_lang() in the page files.
The url_for_lang helper function calls url_for helper function. If we directly replace url_for with url_for_lang, the following would happened:
1. The url_for_lang cannot access url_for since it is being replaced. 
2. Cause infinite recursion

Solution
1. Copy url_for function using hexo.extend.helper.get('url_for') and url_for_lang function using hexo.extend.helper.get('url_for_lang') 
for us to access it locally. 
2. Register a new helper function called "url_for" (This should replace the original).
3. Inside the function, create a new variable newThis that copies all properties from this except url_for.
4. Set newThis.url_for to local url_for function and bind url_for function with this(<Site object>).
5. Return the result by calling local url_for_lang.apply(newThis, arguments)
*/

var url_for = hexo.extend.helper.get('url_for')
var url_for_lang = hexo.extend.helper.get('url_for_lang')

//make url_for helper function returning url_for_lang result.
hexo.extend.helper.register('url_for', function () {
    var newThis = { ...this, url_for: url_for.bind(this) } //replace this.url_for by local url_for function.
    return url_for_lang.apply(newThis, arguments) //apply it with url_for_lang to ensure it uses the local url_for function
});