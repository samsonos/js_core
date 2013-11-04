/**
 * SamsonJS Compatibility plugin
 * 
 * Расширение функционала JavaScript фреймоворка SamsonJS
 * Поддержка совместимости со старыми браузерами
 * 
 */
SamsonJS.extend({
	/**
	 * Получить версию браузера IE если это не IE = -1
	 * @memberOf SamsonJS
	 * @returns {Number} Если это браузер IE то его версию иначе -1
	 */
	IEVersion : function()
	{
		// Если это IE
		if (navigator.appName == 'Microsoft Internet Explorer') 
		{	     
			// Регулярное выражение для поиска версии		
	        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	        
	        // Попытаемся найти версию
	        if ( re.exec( navigator.userAgent ) != null) return parseFloat(RegExp.$1);
		}    		
		// Это не IE
		else return -1;
	},
	
	/**
	 * Сравнить текущую версию браузера IE с заданной и если она меньше вернем правду
	 * @memberOf SamsonJS
	 * @param {Number} version Версия браузера для сравнения
	 * @returns boolean TRUE если версия IE браузера ниже указанной
	 */
	IEVersionLowerThan : function( version )
	{
		// Получим версию IE
		var IEV = s.IEVersion();
				
		// Сверим версию
		if( (IEV != -1) && (s.IEVersion() < version) ) return true;
		// Версия выше
		else return false;
	},
	
	/**
	 * Включить поддержку аттрибута placeholder для старых версий браузера IE < 9
	 * @memberOf SamsonJS
	 */
	IEPlaceHolderFix : function()
	{
		// Если мы старенький IE
		if( s.IEVersionLowerThan(9) )
		{
			// Получим все возможные поля ввода
			var inputs = s('input[type="text"],input[type="email"],input[type="url"],input[type="password"]');		
			
			// Проставим описание полей
			inputs.each(function(input)
			{
				input.val( input.a('placeholder') );
			}).focus(function(input)
			{
				input.val('');	
			}).blur(function(input)
			{
				if( ! input.val().length ) input.val( input.a('placeholder') );	
			});
		}
	}	
});

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}