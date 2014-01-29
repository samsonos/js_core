
/**
 * SamsonJS UI plugin
 * 
 * Расширение функционала JavaScript фреймоворка SamsonJS
 * для работы с интерфейсом пользователя 
 */
var SamsonJSUI = 
{ 
	/**
	 * Скрыть текущий элемент DOM 
	 * @memberOf SamsonJS
	 */
	hide : function()
	{
		// Вернем самого себя
		return this.each(function(obj)
		{
			// Изменим стиль элемента DOM
			obj.DOMElement.style.display = 'none';
		});	
	},
	
	/**
	 * Показать текущий элемент DOM
	 */
	show : function()
	{		
		// Вернем самого себя
		return this.each(function(obj)
		{			
			// Если объект это строка таблицы
			if( obj.is('tr')) obj.DOMElement.style.display = 'table-row';
			// Если объект это ячейка таблицы
			else if( obj.is('td')) obj.DOMElement.style.display = 'table-cell';
			// Иначе изменим его стиль элемента DOM
			else obj.DOMElement.style.display = 'block';
		});		
	},
	
	/**
	 * Универсальный метод для получения/устанвоки аттрибута "class" для текущего
	 * элемента DOM
	 * 
	 * @param value Значение для установки в аттрибут "class" элемента DOM 
	 */
	className : function ( value )
	{ 
		// Если у текущего элемента DOM задан аттрибут класс 
		if( this.DOMElement.className !== undefined ) return (String)(_a = this.a( 'className', value ) /*|| this.a( 'class', value )*/ || '');
		// Иначе вернем пустышку
		else return '';
	},
	
	/**
	 * Определить имеет ли текущий элемент DOM указанный класс
	 * 
	 * @param _className Имя класса для проверки
	 * @returns Имеет ли текущий элемент DOM указанный класс
	 */
	hasClass : function ( _className ){	return this.className().match(new RegExp('(\\s|^)' + _className + '(\\s|$)')); },
	
	/**
	 * Добавить указанный класс к текущему элементу DOM.
	 * Указанный класс добавляется только в том случае, если он еще не добавлен
	 * 
	 * @param _className Имя класса для добавления
	 * @returns Указатель на самого себя для цепирования
	 */
	addClass : function ( _className )
	{		
		// Вернем самого себя
		return this.each(function(obj)
		{			
			// Если у элемента DOM еще нет этого CSS класса
			if ( ! obj.hasClass( _className ) ) obj.className( obj.className() + ' ' + _className );
		});		
	},
	
	/**
	 * Автоматически установить указанный класс к текущему элементу DOM если он еще его не имеет
	 * или убрать его если класс уже применен к элементу DOM
	 * 
	 * @param _className Имя класса для добавления
	 * @returns Указатель на самого себя для цепирования
	 */
	toggleClass : function ( _className )
	{		
		// Вернем самого себя
		return this.each(function(obj)
		{			
			// Если у элемента DOM еще нет этого CSS класса - добавим
			if ( ! obj.hasClass( _className ) ) obj.addClass( _className );
			// Иначе уберем его 
			else obj.removeClass( _className );
		});		
	},
	
	/**
	 * Убрать указанный класс у текущему элемента DOM.
	 * Указанный класс убирается только в том случае, если он присутствует
	 * 
	 * @param _className Имя класса для добавления
	 * @returns Указатель на самого себя для цепирования
	 */
	removeClass : function ( _className ) 
	{
		// Вернем самого себя
		return this.each(function(obj)
		{
			// Если у элемента DOM присутствует указанный класс
			if ( obj.hasClass( _className ) ) obj.className( obj.className().replace( new RegExp('(\\s|^)' + _className + '(\\s|$)'), ' ' ));	 
		});	
	},
	
	
	
	/**
	 * Является ли объект отображаемым в данный момент
	 * 
	 * @returns {Boolean} Виден ли данный объект
	 */
	visible : function()
	{
		// Пройдемся вверх по дереву элементов DOM начиная с текущего элемента DOM
		var parentNode = this;
		
		// Бежим пока не дойдем до самого верхнего родительского элемента
		while( parentNode && !(parentNode.DOMElement == window.document.body) ) 
		{			
			// Если родительский элемент имеет стили и он скрыт
			if( parentNode.css('display') === 'none' ) return false;
			
			// Установим указатель на родителя для текущего элемента DOM
			parentNode = parentNode.parent();
		}
		
		// Дошли сюда - значит не один из родителей включая сам элемент
		// не скрыты в данный момент времени
		return true;
	},
	
	/**
	 * Изменить статус отображения текущего элемента DOM на противоположный
	 * Если элемент был скрыт - то отобразим его
	 * Если элемент отображался - то скроем его
	 */
	toggle : function()
	{
		// Если элемент DOM отображается в данный момент - скроем
		if( this.visible() ) this.hide();
		// Иначе - отобразим его
		else this.show();
	},
	
	/**
	 * Получить абсолютные координаты размещения текущего элемента DOM
	 * 
	 * @returns Абсолютные координаты размещения текущего элемента DOM
	 */
	offset : function()
	{
		// Х
		var _left = 0;
		// У
		var _top = 0;	
		
		// Указатель на текущий элемент
		obj = this.DOMElement;		
			
		// Пройдемся вверх по родителям элемента и их "смещениям" 
        while ( obj ) 
        {       	
        	// Прибавим значение
        	_left += obj.offsetLeft-obj.scrollLeft;
        	_top += obj.offsetTop-obj.scrollTop;
        	
        	// Передвинем указатель на родительский "смещенный" элемент
        	obj = obj.offsetParent;            
        }		
        
        // Вернем объект с координатами
        return { left:_left, top:_top };
	},
	
	/**
	 * Универсальный метод для получения/установки параметров UI для текущего элемента DOM
	 * @param {String} 			uiParamName 	Имя параметра UI
	 * @param {Number|String} 	[uiParamValue] 	Значение параметра UI
	 * @param {String} 			[uiUnits='px'] 	Единица изменения параметра UI для установки в style
	 * @returns Указатель на самого себя для цепирования / Значение треюуемого UI параметра 
	 */
	uia : function( uiParamName, uiParamValue, uiUnits )
	{
		// Получим текущий элемент DOM
		var de = this.DOMElement;		
		
		// Если текущий элемент DOM задан - выполним попытку 
		if( !de ) return s.trace('Ошибка получения/установки значения для UI параметра("' + uiParamName + '") -> Нет объектов DOM в текущей выборке');
		
		// Проверим есть ли требуемое свойство у элемента DOM
		if( (de[ uiParamName ] === undefined) && (de.style === undefined) )  
		{
			//s.trace('Ошибка получения/установки значения для UI параметра("'+uiParamName+'") -> У объекта DOM нет свойства "'+uiParamName+'"');
			return 0;
		}
		
		// Потенциально опасный блок!
		try
		{		
			// Попытаемся "безопасно" получить значение параметра отображения элемента
			// сначала как аттрибут самого элемента DOM, а если его нет, то как "стиль" элемента DOM
			if( (uiParamValue === undefined)) return (Number)(de[ uiParamName ] || de.style[ uiParamName ] || 0);	
			// Если нам необходимо установить значение для параметра UI элемента DOM
			else
			{
				// Если элемент DOM имеет значение требуемого параметра "напрямую"
				if( de[ uiParamName ] !== undefined ) de[ uiParamName ] = uiParamValue;
				// Иначе если у элемента DOM есть "стили" и у стиля поддерживается требуемый параметр
				else if ( de.style != undefined )
				{		
					// Попытаемся найти единицу измерения в значении параметра
					if( (typeof(uiParamValue) == 'string') && uiParamValue.match(/(px|em|%)/) ) uiUnits = '';
					// Если единицы не указаны в величине и не задананы параметром - установим px
					else if( uiUnits === undefined ) uiUnits = '';
				
					// Установим значение CSS параметра
					de.style[ uiParamName ] = uiParamValue+uiUnits;
				}
				// Вермен успех
				return true;
			} 		
		}
		catch(e){s.trace('Ошибка получения/установки значения для UI параметра("' + uiParamName + '") -> '+e.stack.toString());}
	},
	
	/**
	 * Clear DOMElement style attribute
	 * @returns {SamsonJS} Chaining
	 */
	resetCSS : function()
	{
		// Переберем все элементы DOM в текущей выборке 
		this.each( function( obj )
		{ 
			// Получим текущий элемент DOM
			var de = obj.DOMElement;	
			
			
			de.removeAttribute('style');
		});
		
		// Если есть что возвращать - вернем иначе продолжим цепирование
		return this;
	},
	
	/**
	 * Установить/Получить для всех элементов DOM из текущей выборки указанное CSS свойство
	 *  
	 * @param {String} 			styleItem 	Имя CSS свойства для установки
	 * @param {String|Integer} 	styleValue 	Значение CSS свойства
	 * @param {String}			styleUnits 	Единица изменения CSS свойства
	 * @return Текущее значение параметра CSS 	  
	 */
	css : function ( styleItem, styleValue  )
	{
		// Переменная для возвращения значения
		var retVal = undefined;
		
		// Переберем все элементы DOM в текущей выборке 
		this.each( function( obj )
		{ 
			// Получим текущий элемент DOM
			var de = obj.DOMElement;		
			
			// Получим CSS стили элемента
			var style = window.getComputedStyle ? window.getComputedStyle( de ) : (de.currentStyle ? de.currentStyle : de.style);
			
			// Получим "правильное" имя CSS параметра						
			styleItem = styleItem.replace(/(\-([a-z]){1})/g, function(){ return arguments[2].toUpperCase();});
			
			// Если текущий элемент DOM задан - выполним попытку 
			if( ! obj.length ) return s.trace('Ошибка получения/установки значения для CSS параметра("' + styleItem + '") -> Нет объектов DOM в текущей выборке');
			
			// Проверим есть ли требуемое свойство у элемента DOM
			if( style === undefined ) return s.trace('Ошибка получения/установки значения CSS параметра("'+styleItem+'") -> Объекта DOM не поддерживает CSS свойства');			
			
			// Потенциально опасный блок!
			try
			{		
				// Попытаемся "безопасно" получить значение параметра отображения элемента
				// сначала как аттрибут самого элемента DOM, а если его нет, то как "стиль" элемента DOM
				if( (styleValue === undefined)) return (retVal = style[ styleItem ]);	
				// Если нам необходимо установить значение для параметра UI элемента DOM
				else if ( de.style != undefined )
				{						
					// Установим значение CSS параметра
					de.style[ styleItem ] = styleValue;			 		
				}
			}
			catch(e){s.trace('Ошибка получения/установки значения для CSS параметра("'+styleItem+'") -> '+e.stack.toString());}	
		});
		
		// Если есть что возвращать - вернем иначе продолжим цепирование
		return styleValue === undefined ? retVal : this;
	},
	
	/**
	 * Получить/Установить значение положения левого вехнего угла текущего элемента DOM по оси Y
	 * @param {Number} value Новое значение положения левого вехнего угла текущего элемента DOM по оси Y
	 * @param {String} units Единица измерения параметра( px, %, em, ... )
	 * @returns Значение положения левого вехнего угла текущего элемента DOM по оси Y
	 */
	top : function( value, units ){ if( units === undefined ) units = 'px'; return (Number)(this.uia( 'top', value, units ) || this.uia( 'offsetTop', value, units ) || 0); },
	
	/**
	 * Получить/Установить значение положения левого вехнего угла текущего элемента DOM по оси Х
	 * @param {Number} value Новое значение положения левого вехнего угла текущего элемента DOM по оси Х
	 * @param {String} units Единица измерения параметра( px, %, em, ... )
	 * @returns Значение положения левого вехнего угла текущего элемента DOM по оси Х
	 */
	left : function( value, units ){ if( units === undefined ) units = 'px'; return (Number)( this.uia( 'left', value, units ) || this.uia( 'offsetLeft', value, units ) || 0); },
	
	/**
	 * Получить/Установить "БРАУЗЕРНУЮ" высоту текущего элемента DOM 
	 * @param {Number} value Новое значение высоты объекта
	 * @param {String} units Единица измерения параметра( px, %, em, ... )
	 * @returns Значение высоты текущего элемента DOM 
	 */
	height : function( value, units )
	{ 
		// Установим значение единиц измерения по-умолчанию
		if( units === undefined ) units = 'px'; 
		
		// Попытаемся получить все возможные варианты параметра
		return (Number)( this.uia( 'height', value, units ) || this.uia( 'clientHeight', value, units ) || this.uia( 'innerHeight', value, units ) || 0); 
	},
	
	/**
	 * Получить/Установить "БРАУЗЕРНУЮ" ширину текущего элемента DOM 
	 * @param value Новое значение ширины объекта
	 * @param {String} units Единица измерения параметра( px, %, em, ... )
	 * @returns Значение ширины текущего элемента DOM 
	 */
	width : function( value, units )
	{ 
		// Установим значение единиц измерения по-умолчанию
		if( units === undefined ) units = 'px'; 
		
		// Попытаемся получить все возможные варианты параметра
		return (Number)(this.uia( 'width', value, units ) || this.uia( 'clientWidth', value, units ) || this.uia( 'innerWidth', value, units ) || 0);
	},

	/**
	 * Получить/Установить текущее значение вертикальной прокрутки элемента
	 * @param {Number} value Установливаемое значение величины вертикальной прокрутки элемента 	
	 * @returns {Number} Текущее значение величины вертикальной прокрутки элемента
	 */
	scrollTop : function( value ){ return this.uia( 'scrollTop', value );	},
	
	/**
	 * Получить/Установить текущее значение горизонтальной прокрутки элемента
	 * @param {Number} value Установливаемое значение величины горизонтальной прокрутки элемента	 
	 * @returns {Number} Текущее значение величины горизонтальной прокрутки элемента
	 */
	scrollLeft : function( value ){return this.uia( 'scrollLeft', value ); },
	NscrollLeft : function( value ){return this.uia( 'left', value ); },	
	
	/**
	 * Получить "БРАУЗЕРНУЮ" высоту скролла текущего элемента DOM	 
	 * @returns Значение высоты скролла текущего элемента DOM 
	 */
	scrollHeight : function()
	{ 			
		// Получим значение высоты
		return this.uia( 'scrollHeight') || this.uia( 'innerHeight') || this.uia('clientHeight');			
	},
	
	/**	 
	 * @returns {DOMElement} Элемент DOM для работы со всей страницей документа
	 */
	page : function(){ return s(document.documentElement.clientHeight ? document.documentElement : document.body);},
	
	/**
	 * Получить значение ширины страницы 	 
	 * @returns {Number} Текущее значение величины вертикальной прокрутки страницы
	 */
	pageWidth : function()
	{	
		// Вернем текущее значение прокрутки страницы
		return self.innerWidth || (document.documentElement && document.documentElement.clientWidth) || (document.body && document.body.clientWidth);
	},
	
	/**
	 * Получить значение высоты страницы 
	 * @returns {Number} Текущее значение величины вертикальной прокрутки страницы
	 */
	pageHeight : function()
	{		
		/*
		s.trace('self.innerHeight='+self.innerHeight);
		s.trace('document.body.clientHeight='+document.body.clientHeight);
		s.trace('document.body.offsetHeight='+document.body.offsetHeight);
		s.trace('document.body.scrollHeight='+document.body.scrollHeight);
		s.trace('document.documentElement.scrollHeight='+document.documentElement.scrollHeight);
		*/
		// Вернем текущее значение прокрутки страницы
		return self.innerHeight || (document.documentElement && document.documentElement.clientHeight) || (document.body && document.body.clientHeight);
	},
	
	/**
	 * Получить полную высоту страницы с учетом её скролла 
	 * @returns Значение полной высоты страницы с учетом её скролла 
	 */
	pageScrollHeight : function()
	{ 			
		// Вернем рассчитаную величину
		return s(document.documentElement).uia( 'scrollHeight') || s.pageHeight();
	},
	
	/**
	 * Установить/Получить значение величины вертикальной прокрутки страницы 
	 * @param {Number} value Установливаемое значение величины вертикальной прокрутки страницы 
	 * @returns {Number} Текущее значение величины вертикальной прокрутки страницы
	 */
	pageScrollTop : function( value  )
	{
		// Если необходимо установить значение
		if( value != undefined ) window.scroll( window.scrollX, value );			
		
		// Вернем текущее значение прокрутки страницы
		return self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop);
	},	
	
	/**
	 * Установить/Получить значение величины горизонтальной прокрутки страницы 
	 * @param {Number} value Установливаемое значение величины горизонтальной прокрутки страницы 
	 * @returns {Number} Текущее значение величины горизонтальной прокрутки страницы
	 */
	pageScrollLeft : function( value )
	{
		// Если необходимо установить значение
		if( value != undefined ) window.scroll( value, window.scrollY );			
		
		// Вернем текущее значение прокрутки страницы
		return self.pageXOffset || (document.documentElement && document.documentElement.scrollLeft) || (document.body && document.body.scrollLeft);
	},
};

// Добавим плагин к SamsonJS
SamsonJS.extend( SamsonJSUI );