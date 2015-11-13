
/**
 * SamsonJS AJAX plugin
 * 
 * Расширение функционала JavaScript фреймоворка SamsonJS
 * для поддержки ассинхронных запросов к контроллеру
 * 
 */
SamsonJS.extend({	
	/**
	 * Обработчик ассинхронного запроса к контроллеру
	 * @param url Метод контроллера 
	 * @param successHandler Обработчик успешного ответа контроллера
	 * @param data Коллекция POST параметров для отправки контроллеру
	 * @param completeHandler Обработчик завершения запроса к контроллеру
	 * @param beforeHandler Обработчик вызываемый перед запросом к контроллеру
	 */
	ajax : function( url, successHandler, data, completeHandler, beforeHandler, type )
	{	
		// Указатель на самого себя
		var _self = this;
		
		// Укаазатель на текущий объект для ассинхронного запроса
		var sjsXHR = null;
		
		// Проверим переданный URL для запроса
		if( ! url ) return false;
		
		// Кроссбраузерное получение объекта для AJAX запросов
		if ( typeof XMLHttpRequest != 'undefined') sjsXHR = new XMLHttpRequest();
		else if ( typeof ActiveXObject != 'undefined')
		{
			// IE > 6
			try{ sjsXHR = new ActiveXObject("Msxml2.XMLHTTP"); }
			// IE 5,6
			catch(e){ 
				try{
					sjsXHR = new ActiveXObject("Microsoft.XMLHTTP"); 
				}
				catch(e){}
			}
		}	
		//else if ( typeof XMLHttpRequest != 'undefined') sjsXHR = new XMLHttpRequest();
		
		// Обработчик получения ответа от сервера
		sjsXHR.onreadystatechange = function() 
		{
			// Если это финальная стадия обработки асинхронного запроса
			if ( sjsXHR.readyState == 4 ) 
			{
				// Если указан обработчик успешного ответа от сервера
				if( ( sjsXHR.status == 200 ) && successHandler ) successHandler( sjsXHR.responseText.trim(), sjsXHR.status, sjsXHR );
				
				// Если задан обработчик завершения запроса к контроллеру 
				if( completeHandler ) completeHandler( sjsXHR.responseText, sjsXHR.status, sjsXHR  );
			}			
		};
		
		// По умолчанию отправляем POST
		if (!type) type = 'POST';
		
		// Установим параметры запроса	
		sjsXHR.open( type, url, true, "", "" );        
			
		// Если нам передали НЕ форму
		if( (window.FormData === undefined) || !( data instanceof FormData) ) 
		{	
			xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			try {
			data = JSON.stringify(data);
			} catch(e) {
				console.log('Error sending not form data, e);
			}
			
		}
		
		// Add special async header
        sjsXHR.setRequestHeader('SJSAsync', 'true');
		
		// Обработчик перед отправкой запроса
		if( beforeHandler ) beforeHandler( url, data );
		
		// Выполним запрос к контроллеру
		sjsXHR.send( data );  	
		
		// Вернем себя для цепирования
		return _self;
	},
	
	/**
	 * Обработчик ассинхронного запроса к контроллеру с автоматическим заполнением 
	 * содержимого элементов DOM из текущей выборки
	 * 
	 * @memberOf SamsonJS
	 * @param url Метод контроллера 
	 * @param successHandler Обработчик успешного ответа контроллера
	 * @param data Коллекция POST параметров для отправки контроллеру	
	 * @returs {SamsonJS} Указатель на себя для цепирования	
	 */
	ajaxLoad : function( url, successHandler, data )
	{
		// Указатель на самого себя
		_self = this;	
		
		// Выполним внутреннюю функцию для обработчик группы элементов DOM
		this.each(function( obj )
		{				
			SamsonJS.ajax( url, function( _data ) 
			{						
				// Запишем в текущий элемент DOM значение полученное от сервера
				obj.html( _data );
				
				// Если есть обработчик ответа контроллера - выполним его
				if( successHandler ) successHandler( obj, _data );
				
			}, data );
		});			
		
		// Вернем самого себя
		return _self;
	},
	
	/**
	 * Обработчик ассинхронного запроса к действию контроллера модуля 
	 * с автоматическим заполнением добавлением полученного содержимого в конец DOM
	 * 
	 * @memberOf SamsonJS
	 * @param {String} 		url 			Метод контроллера 
	 * @param {Function} 	successHandler 	Обработчик успешного ответа контроллера
	 * @param {Array}		data 			Коллекция POST параметров для отправки контроллеру	
	 * @returs {SamsonJS} Указатель на себя для цепирования
	 */
	ajaxDOMload : function( url, successHandler, data )
	{
		// Указатель на самого себя
		_self = this;	
						
		// Выполним ассинхронный запрос
		SamsonJS.ajax( url, function( serverResponse ) 
		{			
			// Если получен ответ от сервера
			if( serverResponse ) 
			{			
				// Получим элементы DOM полученные от сервера
				var obj = s( serverResponse );
				
				// Запишем в текущий элемент DOM значение полученное от сервера
				s(document.body).append( obj );
				
				// Если есть обработчик ответа контроллера - выполним его
				if( successHandler ) successHandler( obj );
			}
			
		}, data );		
		
		// Вернем самого себя
		return _self;
	},
	
	/**
	 * Обработчик ассинхронного запроса к действию контроллера модуля, который
	 * срабатывает по нажатию на текущий элемент DOM, с автоматическим заполнением 
	 * добавлением полученного содержимого в конец DOM
	 * 
	 * @memberOf SamsonJS
	 * @see ajaxDOMload()
	 * 
	 * @param url Метод контроллера 
	 * @param successHandler Обработчик успешного ответа контроллера
	 * @param data Коллекция POST параметров для отправки контроллеру
	 * @returs {SamsonJS} Указатель на себя для цепирования	
	 */
	ajaxClickDOMload : function( url, successHandler, data )
	{
		// Указатель на самого себя
		_self = this;	
				
		// Выполним внутреннюю функцию для обработчик группы элементов DOM
		this.each(function( obj )
		{			
			// Обработчик нажатия на элемент
			obj.click( function()
			{
				// Выполним стандартный метод по ассинхронному добавлению элемента в DOM
				s.ajaxDOMload( url, successHandler, data ); 
				
			}, true, true );
		});
		
		// Вернем самого себя
		return _self;
	},
	
	/**
	 * Обработчик ассинхронного запроса к действию контроллера модуля, который
	 * срабатывает по нажатию на текущий элемент DOM, с автоматическим заполнением 
	 * добавлением полученного содержимого в конец DOM
	 * 
	 * @memberOf SamsonJS
	 * @see ajaxClickDOMload()
	 * 
	 * @param successHandler Обработчик успешного ответа контроллера
	 * @param data Коллекция POST параметров для отправки контроллеру
	 * @param beforeHandler Предобработчик 
	 * @returs {SamsonJS} Указатель на себя для цепирования	
	 */
	ajaxLinkDOMload : function( successHandler, data, beforeHandler )
	{
		// Указатель на самого себя
		_self = this;
					
		// Выполним внутреннюю функцию для обработчик группы элементов DOM
		this.each(function( obj )
		{				
			// Обработчик нажатия на элемент
			obj.click( function()
			{
				// Если передан предобработчик
				if( beforeHandler ) beforeHandler( obj );		
				
				// Выполним стандартный метод по ассинхронному добавлению элемента в DOM
				s.ajaxDOMload( obj.a('href'), successHandler, data ); 
				
			}, true, true );
		});
		
		// Вернем самого себя
		return _self;
	},
	
	/**
	 * Ассинхронно отправить форму на сервер 
	 * 
	 * @memberOf SamsonJS
	 * @see SamsonJS.ajax
	 * 	 
	 * @param {String} 		url 	Метод контроллера куда должна отправиться форма
	 * @param {Function}	handler Обработчик ответа от сервера
	 */
	ajaxForm: function( options )
	{				
		// Установим указатель на самого себя
		_self = this;
		
		// Получим обработчик ответа
		var handler = typeof options === 'object' ? options.handler : options;
		
		// Получим URL на который должна отправляться форма 
		var url = typeof options === 'object' ? options.url : _self.a('action') || window.location.href;	
		
		// Определим метод отправки формы
		var type = _self.a('method') ? _self.a('method') : 'POST';
		  
		// Проверим действительно ли мы работаем с формой
		if( _self.is( 'FORM' ) )
		{	    		
		    // Если мы современный браузер
		    // Выполним стандартный обработчик отправки ассинхронных данных
		    if( typeof FormData == 'function' ) SamsonJS.ajax( url, handler, new FormData( _self.DOMElement ), null, null, type );
		    // Для старых браузеров
		    else
		    {
		    	// Потенциально опасное место
		    	try
		    	{	
		    		// Сгенерируем уникальный идентификатор для фрейма
		    		var frame_id = 'ajaxFrame_' + Math.round( Math.random() * 10000);
		    		
			    	// Создадим фрейм для виртуальной формы
			    	var frame = s('<iframe id="' + frame_id + '"></iframe>');			    	
						    	
			    	// Разместим фрейм где-то в "молоке"
			    	frame.css('position', 'absolute');			   
			    	frame.css('top', '-9999px');
			    	frame.css('left', '-9999px');
			    	//frame.css('width','100%');
			    	//frame.css('height','200px');
			    	
			    	// Добавим фрейм к документу
			    	s(document.body).append( frame );				    	
    	   	
			    	// Создадим новую форму
			    	var newForm = s('<form id="_ajax_frame_form_"></form>');	
			    	// Установим "цель" для формы
			    	newForm.a( 'action', url );			    	
			    	// Установим метод отправки формы
			    	newForm.a( 'method', type );	
			    	// Set form target as frame
			    	//newForm.a( 'target', frame_id );
			    	
			    	// If we sending files 
			    	if( s('input[type=file]').length )
			    	{
				    	// !!Set encoding and enctype 
				    	newForm.a('encoding', "multipart/form-data");
				    	newForm.a('enctype',"multipart/form-data");				  
			    	}
			    	
			    	// Переберем все "Файлы" формы т.к. IE не умеет их клонировать
			    	s('input,select,checkbox,textarea', _self ).each(function( input )
			    	{	
			    		// Склонируем файл
			    		var clone = input.clone();
			    		
			    		// Поменяем местами оригинал и клон
			    		input.replace( clone );
	    		
			    		// Подменим в отправляемой форме клона на оригинал
			    		newForm.append( input );			 
			    	});

                    // Append special hidden element to tell SamsonPHP that this is async event
                    newForm.append('<input type="hidden" name="SJSASYNC" value="true">');

			    	// Добавим форму во фрейм
			    	if( s.IEVersionLowerThan(9) ) frame.append( newForm );			    	
			    	else s( 'body', frame ).append( newForm );			
			    	
			      	// Обработчик отпарвки формы
			    	frame.bind({ 
			    		EventName : 'load', 
			    		EventHandler : function( event, target )				    	
				    	{			
			    			//s.trace(frame.DOMElement.document.location.href);			    			

                            var response = frame.html().replace(/\"\\\"/,'\"');

			    			// Вызовем обработчик получения ответа от сервера
			    			if( handler ) handler( response );
			    			
			    			//s(document.body).append( '<textarea cols="50" rows="50">'+response+'</textarea>');
			    			
				    		// Удалим фрейм
						    frame.remove();
				    	}
			    	});

			   			 	    
				    // Отправим нашу виртуальную форму на сервер
				    newForm.DOMElement.submit();
		    	}
		    	catch(e){ s.trace('Ошибка отправки виртуальной формы: ' + e.toString(), true ); }
		    }
		}
	}
	
});
