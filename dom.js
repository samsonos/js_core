/**
 * SamsonJS DOM plugin
 * 
 * Расширение функционала JavaScript фреймоворка SamsonJS
 * для поддержки работы с элементами DOM
 * 
 */
// Добавим плагин к SamsonJS
SamsonJS.extend({	
	
	/**
	 * Получить/Установить значение аттрибута элента(ов) DOM из текущей выборки
	 *  
	 * Если в функцию передан 2-й параметр <code>attributeValue</code> то
	 * Функция переберает все элементы DOM из текущей выборки и устанавливает переданное
	 * значение аттрибуту элемента
	 * 
	 * Если в функцию не передан 2-й параметр <code>attributeValue</code> то
	 * функция возвращает значение аттрибута первого элемента DOM из текущей выборки
	 * 
	 * Под понятием передан/не передан подразумевается сравнение на <code>undefined</code>,
	 * любое другое значение параметра рассценивается как подходящие и метод работает в режиме
	 * "установки" значения
	 * 
	 * Если хотя бы у одного из элементов DOM из текущей выборки отсутствует требуемый
	 * аттрибут то функция прекращает свою работу и возвращает значение <code>undefined</code> 
	 * 
	 * Обо всех ошибках выполнения функцию выводит отладочные сообщения в консоль браузера если он
	 * поддерживается
	 * 
	 * @author Vitaliy Egorov <vitalyiegorov@gmail.com>
	 * @memberOf SamsonJS
	 * 
	 * @param {String} attributeName Имя аттрибута элемента
	 * @param attributeValue Значение аттрибута элемента
	 * @returns Значение аттрибута или указатель на самого себя
	 */
	a : function( attributeName, attributeValue )
	{				
		// Переменная для возвращения значения
		var retVal = undefined;
			
		// Переберем все элементы DOM в текущей выборке 
		this.each( function( obj )
		{ 
			// Указатель на первый элемент DOM полученный из выборки
			var de = obj.DOMElement;	
					
			// Потенциально опасный блок
			try{
				// Если необходимо получить значение аттрибута элемента
				if( attributeValue === undefined )
				{
					// Если у элемента DOM требуемое свойство есть напрямую
					if( de[ attributeName ] !== undefined ) return (retVal = de[ attributeName ]);
					// Если объект поддерживает метод установки аттрибута получим значение динамически
					else if( de.hasAttribute && de.hasAttribute( attributeName ) ) return (retVal = de.getAttribute( attributeName ));
					// Иначе вернем ошибку
					else return s.trace('Ошибка получения аттрибута("'+attributeName+'") элемента "'+de+'"- Аттрибут не найден',true);
				}
				// Установить значение аттрибута
				else 
				{	// Если у элемента DOM требуемое свойство есть напрямую
					if( de[ attributeName ] !== undefined ) de[ attributeName ] = attributeValue;
					// Если объект поддерживает метод установки аттрибута установим значение динамически
					else if( de.hasAttribute && de.hasAttribute( attributeName )) de.setAttribute( attributeName, attributeValue );
					// Иначе вернем ошибку
					else return s.trace('Ошибка установки аттрибута("'+attributeName+'") элемента "'+de+'" - Аттрибут не найден',true);
				}
			// Выведем сложившуюся ошибку
			}catch(e){return s.trace('Ошибка установки/получения аттрибута("'+attributeName+'") элемента "'+de+'" - '+e.toString(),true);}
		});
		
		// Если есть что возвращать - вернем иначе продолжим цепирование
		return attributeValue === undefined ? retVal : this;		
	},	
	
	/**
	 * Получить/Установить текстовое значение для элемента(ов) формы.
	 * 	 
	 * Функция всегда возвращает строку, чтобы можно было работать с ней на выходе 
	 * и например проверять её длину: <p><code>s(selector).val().length</code></p>
	 * 
	 * @see SamsonJS.a
	 * @author Vitaliy Egorov <vitalyiegorov@gmail.com>
	 * @memberOf SamsonJS
	 * 
	 * @param {String} value Значение для установки как текущее 
	 * @returns {String} Значение текстового поля
	 */
	val : function( value ){ var v = this.a( 'value', value ); return (String)( v !== undefined ? v : ''); },
	
	/**
	 * Проверить является ли HTML тэг 1-го элемента DOM из текущей выборки
	 * указанного типа. 
	 * 
	 * Имя тэга можно передавать в любом регистре т.к. обрабатывается его "уменьшенное" 	
	 * 
	 * @author Vitaliy Egorov <vitalyiegorov@gmail.com>
	 * @memberOf SamsonJS
	 *  
	 * @param {String} tagName Имя HTML тэга для сравнения 
	 * @returns {Boolean} Результат сравнения
	 */
	is : function( tagName )
	{			
		// Получим 1-й элемент из текущей выборки DOM
		var de = this.DOMElement;
		
		// Если нет єлемента DOM
		if( !this.length ) return false;
			
		// Проверим соответствует ли тєг элемента DOM требуемому
		return de.tagName && (de.tagName.toLowerCase() == tagName.toLowerCase()) ? true : false;
	},
	
	/**
	 * Клонировать текущий элемент DOM и создать новый объект SamsonJS
	 * 
	 * Если в текущей выборке элементов DOM нет ни одного элемента функция
	 * вернет значение <code>undefined</code> 
	 * 
	 * @author Vitaliy Egorov <vitalyiegorov@gmail.com>
	 * @memberOf SamsonJS
	 * 
	 * @returns {SamsonJS} Новый клонированный объект
	 */
	clone : function(){	return this.DOMElement ? SamsonJS( this.DOMElement.cloneNode(true) ) : undefined; },
	
	/**
	 * Получить родительский элемент DOM для первого элемента DOM из текущей выборки
	 * Если передано имя класса то выполняется поиск родителя с указанным именем класса 
	 * 
	 * Если в текущей выборке элементов DOM нет ни одного элемента функция
	 * вернет значение <code>undefined</code> 
	 * 
	 * @author Vitaliy Egorov <vitalyiegorov@gmail.com>
	 * @memberOf SamsonJS
	 * 
	 * @param _className Класс для выбора родителя 
	 * @returns {SamsonJS} Родительский объект 
	 */
	parent : function( _className )
	{ 
		// Если передан
		if( _className )
		{
			// Установим указатель на текущий элемент
			var _parent = this;
			
			// Пока есть DOM элементы в выборке
			while( _parent.length )
			{
				// Если у нашего родителя задан требуемый класс - вернем его
				if( _parent.hasClass( _className ) ) return _parent;
				
				// Иначе установим указатель на родителя для поднятия вверх по дереву DOM
				_parent = _parent.parent();
			}
		}
		
		// Иначе просто вернем родителя данного элемента
		return this.DOMElement ? SamsonJS( this.DOMElement.parentNode ) : undefined; 
	},
	
	/**
	 * Получить элемент следующий в дереве DOM после первого элемента текущей выборки
	 * Если передано имя класса то выполняется поиск родителя с указанным именем класса
	 * 
	 * Если в текущей выборке элементов DOM нет ни одного элемента функция
	 * вернет значение <code>undefined</code>
	 * 
	 * @author Vitaliy Egorov <vitalyiegorov@gmail.com>
	 * @memberOf SamsonJS
	 * 
	 * @param _className Класс для выбора родителя 
	 * @returns {SamsonJS} Элемент следующий в дереве DOM после первого элемента текущей выборки
	 */
	next : function( _className )
	{
		// Если 1-й элемент DOM текущей выборке задан
		if( this.DOMElement )
		{
			// Если передан
			if( _className )
			{
				// Установим указатель на текущий элемент
				var _elem = this;
				
				// Пока есть DOM элементы в выборке
				while( _elem.length )
				{
					// Если у нашего родителя задан требуемый класс - вернем его
					if( _elem.hasClass( _className ) ) return _elem;
					
					// Иначе установим указатель на родителя для поднятия вверх по дереву DOM
					_elem = _elem.next();
				}
			}
			
			// Получим следующий элемент в дереве DOM
			var nextSibling = this.DOMElement.nextSibling;
			
			// Заплатка для пропуска пробелов и комментариев
			while( nextSibling && (nextSibling.nodeType != 1)) nextSibling = nextSibling.nextSibling;
			
			// Вернем полученный элемент DOM
			return SamsonJS( nextSibling );
		}
		// Вернем 
		else return undefined;
	},
	
	/**
	 * Получить элемент предшествующий первому элементу текущей выборки в дереве DOM
	 * Если передано имя класса то выполняется поиск родителя с указанным именем класса
	 * 
	 * Если в текущей выборке элементов DOM нет ни одного элемента функция
	 * вернет значение <code>undefined</code>
	 * 
	 * @author Vitaliy Egorov <vitalyiegorov@gmail.com>
	 * @memberOf SamsonJS
	 * 	 
	 * @param _className Класс для выбора родителя 
	 * @returns {SamsonJS} Элемент предшествующий первому элементу текущей выборки в дереве DOM
	 */
	prev : function( _className )
	{
		// Если 1-й элемент DOM текущей выборке задан
		if( this.DOMElement )
		{
			// Если передан
			if( _className )
			{
				// Установим указатель на текущий элемент
				var _elem = this;
				
				// Пока есть DOM элементы в выборке
				while( _elem.length )
				{
					// Если у нашего родителя задан требуемый класс - вернем его
					if( _elem.hasClass( _className ) ) return _elem;
					
					// Иначе установим указатель на родителя для поднятия вверх по дереву DOM
					_elem = _elem.prev();
				}
			}
			
			// Получим предшествующий элемент в дереве DOM
			var previousSibling = this.DOMElement.previousSibling;
			
			// Заплатка для пропуска пробелов и комментариев
			while( previousSibling && (previousSibling.nodeType != 1)) previousSibling = previousSibling.previousSibling;
			
			// Вернем полученный элемент DOM
			return SamsonJS( previousSibling );
		}
		// Вернем 
		else return undefined;
	},	
	
	/**
	 * Установить HTML представление для всех элемента DOM из текущей выборки
	 * Или получить HTML представление первого элемента DOM из текущей выборки
	 * @memberOf SamsonJS 
	 * @param {String} [htmlData] HTML представление для установки в элементы DOM из текущей выборки
	 * @return {Mixed} HTML представление первого элемента DOM из текущей выборки
	 */
	html : function( htmlData )
	{ 	
		// Указатель на самого себя
		var _self = this;
		
		// Если есть элементы DOM в текущей выборке
		if( _self.length )
		{
			// Указатель на правильный элемент для прорисовки
			var doc = null;		
			
			// Для IFRAME все через "опу"
			if( this.is('IFRAME') ) doc = ( _self.DOMElement.contentDocument ) ? _self.DOMElement.contentDocument.body : _self.DOMElement.contentWindow.document.body;					
			// Для остальных элементов пока вот так
			else doc = _self.DOMElement;	
			
			// Если передано значение HTML представления для элемента DOM - установим его
			if( htmlData != undefined )
			{			
				// Выполним внутреннюю функцию для обработчик группы элементов DOM
				// Обработчик каждого элемента DOM из текущей выборки
				this.each(function( obj )
				{			
					// Для IFRAME все через "опу"
					if( obj.is('IFRAME') ) doc = ( obj.DOMElement.contentDocument ) ? obj.DOMElement.contentDocument.body : obj.DOMElement.contentWindow.document.body;					
					// Для остальных элементов пока вот так
					else doc = obj.DOMElement;	
					
					// Попытаемся заполнить содержимое элемента DOM так, что бы браузер его прорисовал
					try	
					{ 						
						// Попытаемся заставить браузер прорисовать данные
						if( doc ) doc.innerHTML = ''+htmlData;	
					}
					// Упс чегото не вышло
					catch(e)
					{
						/**
						 * IE не умеет заполнять некоторые элементы
						 * http://msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
						 * http://msdn.microsoft.com/en-us/library/ms532998(v=vs.85).aspx 
						 */
						
						// Создадим временный DIV
						var newDIVContainer = document.createElement('DIV');				
						
						// Запишем в него необходимые HTML данные
						newDIVContainer.innerHTML = ''+htmlData;			
						
						// Получим созданный и прорисованный новый элемент DOM
						var newDOMElement = newDIVContainer.lastChild;			
						
						// Заменим содержимое старого элемента на новое
						obj.DOMElement.parentNode.replaceChild( newDOMElement, obj.DOMElement );				
						
						// Выведем разьеснение того что мы пытались сделать
						//s.trace( 'IE не умеет заполнять некоторые элементы через innerHTML - http://msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx, или неизвестная ошибка: ' );					
					}
				});
			
				// Вернем самого себя
				return _self; 
			}
			// Иначе вернем текущее значение HTML представления элемента DOM
			else return doc.innerHTML;
		}
	},	
	
	/**
	 * Очистить все подчиненные элементы DOM для каждого элемента из текущей выборки
	 * 
	 * Если в текущей выборке элементов DOM нет ни одного элемента функция
	 * вернет значение <code>undefined</code>
	 * 
	 * @author Vitaliy Egorov <vitalyiegorov@gmail.com>
	 * @memberOf SamsonJS
	 * 
	 * @returns {SamsonJS} Указатель на текущий элемент 
	 */
	clear : function()
	{		
		// Потенциально опасный блок	
		try
		{ 
			// Обработчик каждого элемента DOM из текущей выборки и вернем самого себя
			return this.each(function( obj )
			{				
				// Указатель на текущий элемент DOM
				var de = obj.DOMElement; 
			
				// Выполняем цикл пока у текущего элемента DOM есть дети
				while (de.hasChildNodes()) de.removeChild( de.lastChild );					
			});	
		// Выведем ошибку
		}catch(e){ return s.trace('Ошибка удаления подчиненных элементов DOM -> '+e.toString()); };
	},
	
	/**
	 * Удалить элементы DOM из текущей выборки 
	 * @memberOf SamsonJS
	 * @returns {SamsonJS} Указатель на себя для цепирования
	 */
	remove : function()
	{
		// Выполним внутреннюю функцию для обработчик группы элементов DOM
		// Обработчик каждого элемента DOM из текущей выборки
		this.each( function( obj )
		{
			// Удалим все подчиненные элементы DOM
			obj.clear();
			
			// Удалим текущий элемент DOM
			if( obj.DOMElement.parentNode ) obj.DOMElement.parentNode.removeChild( obj.DOMElement );			
		});	
	},
	
	/**
	 * Поменять местами тв дереве DOM документа, текущий элемент  и переданный
	 * 
	 * @param objToReplace Указатель на объект для замены
	 * @returns {SamsonJS} Указатель на новый элемент для цепирования
	 */
	replace : function ( objToReplace )
	{
		// Обезопасим себя на случай передачи строки, или готового элемента DOM
		objToReplace = SamsonJS( objToReplace );	
		
		// Поменяем местами в дерево DOM элементы
		this.DOMElement.parentNode.replaceChild( objToReplace.DOMElement, this.DOMElement );	
	
		// Вернем самого себя
		return objToReplace;	
	},
	
	/**
	 * Присоединить переданный элемент DOM в конец элементов DOM из текущий выборки 
	 * 
	 * @param objToAppend Указатель на элемент DOM который необходимо присоедитнить к элементам DOM из текущей выборки
	 * @param _cloneObj Флаг принудительного копирования присоединяемых объектов
	 */
	append : function( objToAppend, _cloneObj )
	{		
		// Отключим режим принудительного клонирования объектов по умолчанию
		var cloneObj = (_cloneObj === undefined) ? false : true;		
		
		// Обезопасим себя на случай передачи строки, или готового элемента DOM
		objToAppend = SamsonJS( objToAppend );	
				
		// Выполним внутреннюю функцию для обработчик группы элементов DOM
		// Обработчик каждого элемента DOM из текущей выборки
		// Вернем самого себя
		return this.each(function( obj )
		{		
			// Пробежимся по всем элементам DOM из выборки переданного объекта
			objToAppend.each(function(obj2)
			{		
				// Если мы присоеденяем новый элемент DOM то склонируем "присоединяемый" объект
				// иначе присоеденим оригинал элемента DOM, и тогда по факту это все херня
				obj2 = cloneObj ? obj2.clone() : obj2; 				
				
				// Потенциально опасный блок
				try
				{
					// Присоединим к текущему элементу DOM текущий элемент DOM из переданного объекта
					if( obj2.DOMElement ) obj.DOMElement.appendChild( obj2.DOMElement );
				}
				catch(e){ s.trace("Ошибка присоединения элемента -> "+e.toString(),true); }
			});
							 					
		});	
	},
	
	/**
	 * Присоединить переданный элемент DOM в начало элементов DOM из текущий выборки 
	 * 
	 * @param objToAppend Указатель на элемент DOM который необходимо присоедитнить к элементам DOM из текущей выборки
	 * @param _cloneObj Флаг принудительного копирования присоединяемых объектов
	 */
	prepend : function( objToAppend, _cloneObj )
	{
		// Отключим режим принудительного клонирования объектов по умолчанию
		var cloneObj = (_cloneObj === undefined) ? false : true;
		
		// Обезопасим себя на случай передачи строки, или готового элемента DOM
		objToAppend = SamsonJS( objToAppend );		
			
		// Выполним внутреннюю функцию для обработчик группы элементов DOM
		// Обработчик каждого элемента DOM из текущей выборки
		// Вернем самого себя
		return this.each(function( obj )
		{			
			// Пробежимся по всем элементам DOM из выборки переданного объекта
			objToAppend.each(function(obj2)
			{				
				// Если мы присоеденяем новый элемент DOM то склонируем "присоединяемый" объект
				// иначе присоеденим оригинал элемента DOM, и тогда по факту это все херня
				obj2 = cloneObj ? obj2.clone() : obj2; 
				
				// Присоединим к текущему элементу DOM текущий элемент DOM из переданного объекта
				if( obj2.DOMElement ) 
				{
					// Если у текущего элемента DOM есть дети
					if( obj.DOMElement.firstChild )	obj.DOMElement.insertBefore( obj2.DOMElement, obj.DOMElement.firstChild );
					// Иначе добавим первого ребенка
					else obj.DOMElement.appendChild( obj2.DOMElement );
				}
			});							 					
		});	
	},
	
	/**
	 * Присоединить текущий элемент DOM к объектам DOM в переданном объекте
	 * 
	 * @param objToAppendTo Указатель на элемент DOM к которому необходимо присоедитнить элементы DOM из текущей выборки
	 */
	appendTo : function( objToAppendTo )
	{
		// Обезопасим себя на случай передачи строки, или готового элемента DOM
		objToAppendTo = SamsonJS( objToAppendTo );	
		
		// Выполним внутреннюю функцию для обработчик группы элементов DOM
		// Обработчик каждого элемента DOM из текущей выборки
		// Вернем самого себя
		return this.each(function( obj )
		{			
			// Присоединим к переданному элементу DOM элементы из текущей выборки DOM
			if( objToAppendTo.DOMElement ) objToAppendTo.DOMElement.appendChild( obj.DOMElement );				 					
		});	
	},
	
	/**
	 * Вставить элемент перед уже каждым текущим объектом DOM из выборки
	 * 
	 * @author Vitaliy Egorov <vitalyiegorov@gmail.com>
	 * @memberOf SamsonJS
	 * 
	 * @param {SamsonJS} objToInsert 	Объект который необходимо вставить	
	 * @returns {SamsonJS} Указатель на самого себя
	 */
	insertBefore : function( objToInsert )
	{
		// Проверим объект который необходимо вставить
		if( !objToInsert.DOMElement )
		{
			s.trace('Ошибка вставления объкта в DOM, не передан вставляемый объект');
			
			// Вернем самого себя
			return this;
		}
		
		// Выполним внутреннюю функцию для обработчик группы элементов DOM
		// Обработчик каждого элемента DOM из текущей выборки
		// Вернем самого себя
		return this.each(function( obj )
		{		
			// Получим родительский элемент
			var parentObj = obj.parent();
			
			// Проверим родительский объект
			if( !parentObj.DOMElement ) return s.trace('Ошибка вставления объкта в DOM, не получен родительский объект');			
			
			// Вставим новый объект перед текущим 
			parentObj.DOMElement.insertBefore( objToInsert.DOMElement, obj.DOMElement ); 					
		});	
	},
	
	/**
	 * Получить текстовое представление текущего элемента DOM 
	 */
	text : function()
	{		
		// Если есть элементы в текущей выборке
		if( this.DOMElement )
		{				
			// Если это "нормальный" браузер
			if( this.DOMElement.innerText ) return this.DOMElement.innerText;
			// Если это IE
			else if( this.DOMElement.textContent ) return this.DOMElement.textContent;		
		}
		
		// Вернем пустую строку
		return '';
	},
	
	/**
	 * Освобобить/Заблокировать текущий элемент
	 * @param option Переданный элемент OPTION для выставления
	 * @returns Самого себя для цепирования
	 */
	enabled : function( status )
	{
		// Заблокируем элемент
		if( status == false ) this.a('disabled','');
		// Разблокируем элемент
		else this.DOMElement.removeAttribute('disabled');
		
		// Вернем себя
		return this;
	},	
	
	/**
	 * Определить является ли картинка, если текущий DOM элемент картинка,
	 * полностью загруженной в документе
	 * 
	 * @returns {Boolean} Загружена ли картинка в документ
	 */
	loaded : function()
	{
		// Проверим что это картинка
		if( this.length && this.is('IMG') )
		{
			// Получим текущий элемент DOM
			var img = this.DOMElement;
			
			// During the onload event, IE correctly identifies any images that
		    // weren’t downloaded as not complete. Others should too. Gecko-based
		    // browsers act like NS4 in that they report this incorrectly.
		    if ( !img.complete ) return false;		    
	
		    // However, they do have two very useful properties: naturalWidth and
		    // naturalHeight. These give the true size of the image. If it failed
		    // to load, either of these should be zero.	
		    if ( (typeof img.naturalWidth !== undefined) && (img.naturalWidth == 0) ) return false;
		}

	    // No other way of checking: assume it’s ok.
	    return true;
	}
});