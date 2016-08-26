/**
 * SamsonJS AJAX plugin
 * 
 * Расширение функционала JavaScript фреймоворка SamsonJS
 * для поддержки ассинхронных запросов к контроллеру
 * 
 */
SamsonJS.extend({
	/**
	 * Кроссбраузерный метод для назначения события для элемента DOM
	 * @memberOf SamsonJS
	 * @param EventName 		Имя события для назначения
	 * @param EventHandler 		Обработчик события
	 * @param preventDefault	Запретить стандартное поведение события
	 * @param stopPrapagation   Запретить всплывание события
	 * @param EventOptions   	Параметры для передачи в обработчик события
	 * 
	 * @returns Указатель на самого себя для цепирования
	 */
	bind : function( options )
	{
		// Указатель на самого себя
		var _self = this;
		
		// Если передан объект с параметрами 
		if( typeof options == 'object' )
		{
			// Имя события для назначения
			var EventName = options.EventName;
			
			// Обработчик события
			var EventHandler = options.EventHandler;	
			
			// Дополнительные параметры для обработчика события
			var EventOptions = options.EventOptions;		
			
			// Выполним внутреннюю функцию для обработчик группы элементов DOM
			this.each(function( obj )
			{		
				// Указатель на текущий элемент DOM
				var de = obj.DOMElement;
				
				// No events for TextNodes
				if ( de.nodeType == 3 ) return true;
				
				// Если не передан обработчик события и объект поддерживает указанное событие
				// считаем что это запрос на вызов события
				if( ! EventHandler && de[ EventName ])
				{					
					// Вызовем событие элемента
					de[ EventName ]();
				}
				// Иначе повесим обработчик события
				else
				{
					// Создадим обертку для срабатывания события для выделения общих действий
					var _baseEventHandler = function( event )
					{			
						// Добавим target для ie
						if (!event.target) event.target = event.srcElement;					 
							
						// добавить relatedTarget в IE, если это нужно						
						if (!event.relatedTarget && event.fromElement) event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;
							
						// вычислить pageX/pageY для IE
						if ( event.pageX == null && event.clientX != null ) 
						{
							var html = document.documentElement, body = document.body;
							event.pageX = event.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
							event.pageY = event.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
						}
							
						// записать нажатую кнопку мыши в which для IE
						// 1 == левая; 2 == средняя; 3 == правая						
						if ( !event.which && event.button ) event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
						
						// Вызовем переданный обработчик с передачей событий, передадим в него  
						// указатель на этот элемент до выполнения события, элемент
						// с которым это событие произошло,	и дополнительные параметры
						// Получим результат выполнения метода, и обработаем только отрицательный ответ				
						var result = EventHandler( obj, EventOptions, event ) === false ? false : true; 					
						
						// Запретить "всплывание" элемента, или если это было запрещено в обработчике
						if( options.preventDefault || !result) (event.preventDefault) ? (event.preventDefault()) : (event.returnValue = false );
						
						// Запретить стандартное поведение элемента, или если это было запрещено в обработчике
						if( options.stopPrapagation || !result) (event.stopPropagation) ? (event.stopPropagation()) : (event.cancelBubble = true );
					};					
					
					// Создадим коллекцию для хранения обработчиков событий для данного элемента
					de.EventListeners = de.EventListeners === undefined ? {} : de.EventListeners;
					// Безопасно создадим коллекцию для обработчиков указанного события
					de.EventListeners[ EventName ] = !de.EventListeners[ EventName ] ? [] : de.EventListeners[ EventName ];
					// Добавим созданный обработчик события в коллекцию обработчиков
					de.EventListeners[ EventName ].push( _baseEventHandler );
					
					// Проверим если элемент DOM поддерживает метод "addEventListener"
					if( de.addEventListener ) de.addEventListener( EventName, _baseEventHandler, false );
					// Проверим если элемент DOM поддерживает метод "attachEvent", преобразуем название события
					else if(de.attachEvent) de.attachEvent( 'on' + EventName, _baseEventHandler );
					// Самый de вариант повесим обработчик напрямую на свойство элемента
					else if( de[ 'on' + EventName ] ) de[ 'on' + EventName ] = _baseEventHandler ;
					// Ниче не вышло
					else s.trace('Не удалось повесить событие:' + EventName + ' для селектора: ' + obj.selector );
					
					//s.trace('Добавляем событие:' + EventName);				
				}
			});				
		}
		
		// Вернем самого себя
		return _self;
	},	
	
	/**
	 * 
	 */
	unbind : function( EventName, EventHandler )
	{
		// Выполним внутреннюю функцию для обработчик группы элементов DOM
		this.each(function( obj )
		{	
			// Указатель на текущий элемент DOM
			var DOMElement = obj.DOMElement;			
			
			// Если у элемента DOM присутствуют обработчики указанного события
			if( DOMElement.EventListeners && DOMElement.EventListeners[ EventName ] )
			{
				// Пробежимся по всем обработчикам данного события и уничтожем их
				for ( var i = 0; i < DOMElement.EventListeners[ EventName ].length; i++) 
				{			
					// Текущий обрабочик события из выборки
					var cEventHandler = DOMElement.EventListeners[ EventName ][ i ];
					
					// Если передан конкретный обработчик события который необходимо уничтожить
					if( EventHandler && (typeof EventHandler === 'function') &&  (cEventHandler === EventHandler))
					{
						// Если браузер поддерживает метод removeEventListener
						if( DOMElement.removeEventListener ) DOMElement.removeEventListener( EventName, cEventHandler ); 
						// Если браузер лох и поддерживает метод detachEvent
						else if(DOMElement.detachEvent) DOMElement.detachEvent( 'on' + EventName, cEventHandler );
					}					
					// Если браузер поддерживает метод removeEventListener
					else if( DOMElement.removeEventListener ) DOMElement.removeEventListener( EventName, cEventHandler ); 
					// Если браузер лох и поддерживает метод detachEvent
					else if(DOMElement.detachEvent) DOMElement.detachEvent( 'on' + EventName, cEventHandler );
				}
			}
		});
		
		return this;
	},
	
	/**
	 * Обработчик загрузки элемента DOM и его прорисовки
	 * 
	 * @param loadHandler 		Обработчик загрузки элемента 
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	load : function( loadHandler, preventDefault, stopPrapagation, options )
	{
		// Повесим обработчик на элементы DOM из текущий выборки
		// Вернем самого себя
		return this.bind({ 
			EventName 		: 'load',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
			EventHandler 	: loadHandler,
			EventOptions	: options
		});		
	},
		
	/**
	 * Стандартный инициализатор JavaScript для страницы
	 * Выполняет проверку страницу на наличие специального идентификатора подтверждающего
	 * то что эта именно та страница где необходимо выполнить указанный обработчик её загрузки
	 * 
	 * @param pageInitHandler	Обработчик инициализация JavaScript на указанной странице
	 * @returns _(SamsonJS) Указатель на самого себя для цепирования
	 */
	pageInit : function( pageInitHandler )
	{	
		// Указатель на самого себя
		var _self = this;
		
		// If no handler is passed
		if( pageInitHandler == undefined ) return this; 
		
		// Обработчик загрузки страницы
		var handler = function()
		{		
			// Если мы уже выполнили этот обработчик
			if( pageInitHandler.done === true ) return true;
			
			// Установим флаг выполнения данной функции
			pageInitHandler.done = true;
			
			// После загрузки документа попытаемся получить элемент
			// по указаному селектору
			var element = SamsonJS( _self.selector );
			
			// Если текущий элемент найден
			if( element.length && pageInitHandler ) 
			{
				//s.trace('Обработчик инициализация страницы('+_self.selector+') - '+SamsonPHP.elapsed()+' мс',true);
				
				// Выполним обработчик
                element.each(pageInitHandler);
			}
		};	
			
		// Повесим обработчик на специальное событие
		s(document).bind({
			EventName	: 'DOMContentLoaded',
			EventHandler: handler
		});
		
		// Повесим обработчик для всех браузеров
		s(window).load( handler );
	
		// Вернем самого себя
		return this;
	},
	
	/**
	 * Обработчик нажатия на элемент DOM
	 * 
	 * @param clickHandler 		Обработчик нажатия на элемент 
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	click : function( clickHandler, preventDefault, stopPrapagation, options )
	{				
		// Повесим обработчик нажатия на текущий элемент DOM
		// Вернем самого себя
		return this.bind({ 
			EventName 		: 'click',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
			EventHandler 	: clickHandler,
			EventOptions	: options
		});		
	},
	
	/**
	 * Обработчик изменения значения в текущем элементе DOM
	 * 
	 * @param changeHandler 	Обработчик изменения значения в текущем элементе DOM
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	change : function( changeHandler, preventDefault, stopPrapagation, options )
	{								
		// Повесим обработчик изменения значения в текущем элементе DOM и вернем самого себя	
		return this.bind({ 
			EventName 		: 'change',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
            EventHandler 	: function( obj, options, event)
            {
                // Get selected option
                var selected = s('option:selected',obj);

                // Call event handler
                changeHandler(obj, options, event, selected);
            },
			EventOptions	: options
		});	
	},
	
	/**
	 * Обработчик перемещения миши над текущим элементом DOM
	 * 
	 * @param moveHandler 		Обработчик перемещения миши над текущим элементом DOM
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	mousemove : function( moveHandler, preventDefault, stopPrapagation, options )
	{
		// Повесим обработчик перемещения миши над текущим элементом DOM и вернем самого себя		
		return this.bind({ 
			EventName 		: 'mousemove',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
			EventHandler 	: moveHandler,
			EventOptions	: options
		});	
	},
	
	/**
	 * Обработчик перемещения колесика миши
	 * 
	 * @param moveHandler 		Обработчик перемещения колесика миши
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	mousescroll : function( moveHandler, preventDefault, stopPrapagation, options )
	{
		// Повесим обработчик перемещения миши над текущим элементом DOM и вернем самого себя		
		return this.bind({ 
			EventName 		: 'mousewheel',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
			EventHandler 	: moveHandler,
			EventOptions	: options
		});	
	},
	
	/**
	 * Обработчик покидания миши текущего элемента DOM
	 * 
	 * @param mouseHandler 		Обработчик покидания миши текущего элемента DOM
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	mouseout : function( mouseHandler, preventDefault, stopPrapagation, options )
	{
		// Повесим обработчик покидания миши текущего элемента DOM и вернем самого себя		
		return this.bind({ 
			EventName 		: 'mouseout',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
			EventHandler 	: mouseHandler,
			EventOptions	: options
		});	
	},
	
	/**
	 * Обработчик попадания миши на текущий элемента DOM
	 * 
	 * @param mouseHandler 		Обработчик попадания миши на текущий элемента DOM
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	mouseover : function( mouseHandler, preventDefault, stopPrapagation, options )
	{
		// Повесим обработчик попадания миши на текущий элемента DOM и вернем самого себя		
		return this.bind({ 
			EventName 		: 'mouseover',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
			EventHandler 	: mouseHandler,
			EventOptions	: options
		});	
	},
	
	/**
	 * Обработчик нажатия клавиши миши над текущим элементом DOM
	 * 
	 * @param mouseHandler 		Обработчик нажатия клавиши миши над текущим элементом DOM
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	mousedown : function( mouseHandler, preventDefault, stopPrapagation, options )
	{
		// Повесим обработчик нажатия клавиши миши над текущим элементом DOM и вернем самого себя		
		return this.bind({ 
			EventName 		: 'mousedown',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
			EventHandler 	: mouseHandler,
			EventOptions	: options
		});	
	},
	
	/**
	 * Обработчик отпускания клавиши миши над текущим элементом DOM
	 * 
	 * @param mouseHandler 		Обработчик отпускания клавиши миши над текущим элементом DOM
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	mouseup : function( mouseHandler, preventDefault, stopPrapagation, options )
	{
		// Повесим обработчик отпускания клавиши миши над текущим элементом DOM и вернем самого себя		
		return this.bind({ 
			EventName 		: 'mouseup',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
			EventHandler 	: mouseHandler,
			EventOptions	: options
		});	
	},
	
	/**
	 * Обработчик отпускания клавиши клавиатуры в текущим элементом DOM
	 * 
	 * @param mouseHandler 		Обработчик отпускания клавиши клавиатуры в текущим элементом DOM
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	keyup : function( mouseHandler, preventDefault, stopPrapagation, options )
	{
		// Повесим обработчик отпускания клавиши клавиатуры в текущим элементом DOM и вернем самого себя		
		return this.bind({ 
			EventName 		: 'keyup',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
			EventHandler 	: mouseHandler,
			EventOptions	: options
		});	
	},
	/**
	 * Обработчик нажатия символьной клавиши клавиатуры в текущим элементом DOM
	 * 
	 * @param mouseHandler 		Обработчик нажатия символьной клавиши клавиатуры в текущим элементом DOM
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	keypress : function( mouseHandler, preventDefault, stopPrapagation, options )
	{
		// Повесим обработчик отпускания клавиши клавиатуры в текущим элементом DOM и вернем самого себя		
		return this.bind({ 
			EventName 		: 'keypress',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
			EventHandler 	: mouseHandler,
			EventOptions	: options
		});	
	},
	
	/**
	 * Обработчик нажатия клавиши клавиатуры в текущим элементом DOM
	 * 
	 * @param mouseHandler 		Обработчик нажатия клавиши клавиатуры в текущим элементом DOM
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	keydown : function( mouseHandler, preventDefault, stopPrapagation, options )
	{
		// Повесим обработчик нажатия клавиши клавиатуры в текущим элементом DOM и вернем самого себя		
		return this.bind({ 
			EventName 		: 'keydown',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
			EventHandler 	: mouseHandler,
			EventOptions	: options
		});	
	},
	
	/**
	 * Обработчик получения фокуса текущим элементом DOM
	 * 
	 * @param mouseHandler 		Обработчик нажатия клавиши клавиатуры в текущим элементом DOM
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	focus : function( mouseHandler, preventDefault, stopPrapagation, options )
	{
		// Повесим обработчик получения фокуса текущим элементом DOM и вернем самого себя		
		return this.bind({ 
			EventName 		: 'focus',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
			EventHandler 	: mouseHandler,
			EventOptions	: options
		});	
	},
	
	/**
	 * Обработчик события когда элементом DOM теряет фокус
	 * 
	 * @param mouseHandler 		Обработчик нажатия клавиши клавиатуры в текущим элементом DOM
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	blur : function( mouseHandler, preventDefault, stopPrapagation, options )
	{
		// Повесим обработчик потери фокуса текущим элементом DOM и вернем самого себя		
		return this.bind({ 
			EventName 		: 'blur',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
			EventHandler 	: mouseHandler,
			EventOptions	: options
		});	
	},
	
	/**
	 * Обработчик события когда элементом DOM прокручтвается
	 * 
	 * @param mouseHandler 		Обработчик нажатия клавиши клавиатуры в текущим элементом DOM
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	scroll : function( mouseHandler, preventDefault, stopPrapagation, options )
	{
		// Повесим обработчик потери фокуса текущим элементом DOM и вернем самого себя		
		return this.bind({ 
			EventName 		: 'scroll',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
			EventHandler 	: mouseHandler,
			EventOptions	: options
		});	
	},
	
	/**
	 * Обработчик получения фокуса текущим элементом DOM
	 * 
	 * @param mouseHandler 		Обработчик нажатия клавиши клавиатуры в текущим элементом DOM
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	focusin : function( mouseHandler, preventDefault, stopPrapagation, options )
	{
		// Повесим обработчик получения фокуса текущим элементом DOM и вернем самого себя		
		return this.bind({ 
			EventName 		: 'focusin',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
			EventHandler 	: mouseHandler,
			EventOptions	: options
		});	
	},
	
	/**
	 * Обработчик события когда элементом DOM теряет фокус
	 * 
	 * @param mouseHandler 		Обработчик нажатия клавиши клавиатуры в текущим элементом DOM
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	focusout : function( mouseHandler, preventDefault, stopPrapagation, options )
	{
		// Повесим обработчик потери фокуса текущим элементом DOM и вернем самого себя		
		return this.bind({ 
			EventName 		: 'focusout',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
			EventHandler 	: mouseHandler,
			EventOptions	: options
		});	
	},
	
	/**
	 * Обработчик события отправки формы
	 * 
	 * @param mouseHandler 		Обработчик события отправки формы
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	submit : function( mouseHandler, preventDefault, stopPrapagation, options )
	{
		// Повесим обработчик события отправки формы и вернем самого себя		
		return this.bind({ 
			EventName 		: 'submit',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
			EventHandler 	: mouseHandler,
			EventOptions	: options
		});	
	},
	
	/**
	 * Обработчик события изменения размера элемента
	 * 
	 * @param mouseHandler 		Обработчик события отправки формы
	 * @param preventDefault 	Запретить стандартное поведение элемента
	 * @param stopPrapagation 	Запретить "всплывание" элемента
	 * @param options 			Дополнительные параметры для обработки внутри события
	 */
	resize : function( mouseHandler, preventDefault, stopPrapagation, options )
	{
		// Повесим обработчик события отправки формы и вернем самого себя		
		return this.bind({ 
			EventName 		: 'resize',
			preventDefault 	: preventDefault,
			stopPrapagation : stopPrapagation,
			EventHandler 	: mouseHandler,
			EventOptions	: options
		});	
	}
});