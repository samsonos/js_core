/**
 * SamsonJS UI Effects plugin
 * Расширение функционала JavaScript фреймоворка SamsonJS * 
 * Универсальный обработчик анимирования изменения параметров элемента
 */ 
SamsonJS.extend({
	/**
	 * Универсальная функция для выполнения анимированного изменения параметра элемента	
	 * @memberOf SamsonJS	
	 * 
	 * @param {Number} 			fValue			Конечное значение параметра элемента
	 * @param {String} 			paramName		Имя параметра элемента для изменения
	 * @param {String} 			time			Длительность анимации
	 * @param {Function}		finishHandler	Обработчик завершения изменения параметра
	 * @param {Number}			frame_count		Количество кадров в секунду(FPS)
	 * @returns {SamsonJS}		Указатель на себя цепирования
	 */
	animate : function( fValue, paramName, time, finishHandler, frame_count )
	{
		// Определим скорость анимации
		switch( time )
		{
			case 'slow'		: time = 400;	break;
			case 'fast'		: time = 200; 	break;
			case undefined	: time = 300; 	break;
		}			
		
		// Определим количество кадров в секунду анимации, по умолчанию 30 
		frame_count = frame_count ? frame_count : 24;
		
		// Рассчитаем интервал срабатывания таймера, как количество кадров в секунду и переведем в мс
		var animation_timer =  1000 / frame_count;		
		
		// Рассчитаем кооличество шагов анимации которые необходимо выполнить за данное время
		var animation_steps_count = time / animation_timer;
		
		// Переберем все элементы DOM из текущей выборки
		return this.each(function(o)
		{				
			// Определим обработчик для работы с параметром
			// Будеи исполдьзовать оберточные функции для защиты вызова this
			var handler = typeof(o[ paramName ]) == 'function'	
				// Будем использовать встроенную во фреймворк функцию
				? function( value ){ return o[ paramName ]( value ); } 
				// Будем использовать универсальную функцию	
				: function( value ){ return o.uia( paramName, value ); }; 
			
			// Получим текущее значение параметра элемента
			var cValue = handler();					
			
			// Определим направление изменения размера элемента
			var direction = ( fValue > cValue ) ? 1 : -1;
			
			// Переменная для хранения экземпляра таймера для его остановки
			var animation = null;				
			
			// Рассчтиаем "величину" изменения параметра
			var distance = Math.abs(fValue) - cValue;
			
			// Рассчитаем шаг изменения параметра анимации за один кадр анимации
			var animation_step = Math.abs( distance / animation_steps_count);
			
			//s.trace('FC:'+frame_count+',Start:'+cValue+', Stop:'+fValue+',Step:'+animation_step+',Distance:'+distance+',Timer:'+animation_timer);
			
			// Запустим интервал для анимации скроллинга элемента
			animation = setInterval( function()
			{			
				//s.trace('cValue:'+cValue+', Step:'+animation_step);
				
				// Поправочное условия для изменения величины шага изменения параметра для точного попадания в граничное условие
				if( Math.abs(Math.abs( fValue ) - cValue) < animation_step ) animation_step = Math.abs( Math.abs( fValue ) - cValue );				
						
				// Если нам нечего больше изменять и мы дошли до необходимого значения параметра
				if( animation_step === 0 )
				{
					// Если задан обработчик завершения прорисовки выполним его
					if( finishHandler ) finishHandler( o );
					
					// Отменим анимацию
					clearInterval( animation );					
				}
				
				//s.trace( 'Анимированное изменение параметра("'+paramName+'") элемента ['+cValue+','+fValue+','+animation_step+']');
		
				// Изменим значение параметра элемента на величину шага учитывая направление изменений
				cValue = cValue + (direction*animation_step);				
				
				// Установим новое значение параметра элемента
				handler( cValue );				
				
			}, animation_timer );	
		});
	},
	
	/**
	 * Выполнить анимированное изменение высоты элемента
	 * @memberOf SamsonJS	
	 * @param {Number} 		fValue			Конечное значение параметра элемента	 
	 * @param {String} 		speed			Скорость изменения параметра
	 * @param {Function}	finishHandler	Обработчик завершения изменения параметра
	 * @returns {SamsonJS}	Указатель на себя цепирования
	 */
	heightTo: function( fValue, speed, finishHandler )
	{	
		// Выполним универсальный аниматор с указанием конкретного параметра
		return this.animate( fValue, 'height', speed, finishHandler );	
	},
	
	/**
	 * Выполнить анимированное изменение вертикальной прокрутки элемента
	 * @memberOf SamsonJS	
	 * @param {Object|Number} 	fValue			Конечное значение параметра элемента	 
	 * @param {String} 			speed			Скорость изменения параметра
	 * @param {Function}		finishHandler	Обработчик завершения изменения параметра
	 * @returns {SamsonJS}	Указатель на себя цепирования
	 */
	scrollTopTo: function( fValue, speed, finishHandler )
	{	
		// Если нам передан объект, учтем его смещения и текущую прокрутку
		if( typeof( fValue ) == 'object' ) fValue = fValue.offset().top;		
		// Если конечное значение не передано - установим максимальное
		else if ( fValue == undefined ) fValue = this.DOMElement.scrollHeight;			
		
		// Выполним универсальный аниматор с указанием конкретного параметра
		return this.animate( fValue, 'scrollTop', speed, finishHandler );	
	},

    /**
     * Выполнить анимированное изменение горизонтальной прокрутки элемента
     * @memberOf SamsonJS
     * @param {Object|Number} 	fValue			Конечное значение параметра элемента
     * @param {String} 			speed			Скорость изменения параметра
     * @param {Function}		finishHandler	Обработчик завершения изменения параметра
     * @returns {SamsonJS}	Указатель на себя цепирования
     */
    scrollLeftTo: function( fValue, speed, finishHandler )
    {
        // Если нам передан объект, учтем его смещения и текущую прокрутку
        if( typeof( fValue ) == 'object' ) {
            // Pointer to object
            var obj = fValue;

            fValue = obj.offset().left;

            // Remove parent container offset to avoid "over scrolling"
            if (obj.parent().length) {
                fValue -= obj.parent().offset().left;
            }
        }
        // Если конечное значение не передано - установим максимальное
        else if ( fValue == undefined ) fValue = this.DOMElement.scrollLeft;



        // Выполним универсальный аниматор с указанием конкретного параметра
        return this.animate( fValue, 'scrollLeft', speed, finishHandler );
    },
	
	/**
	 * Выполнить анимированное изменение вертикальной прокрутки страницы
	 * @memberOf SamsonJS	
	 * @param {Object|Number} 	fValue			Конечное значение параметра элемента	 
	 * @param {String} 			speed			Скорость изменения параметра
	 * @param {Function}		finishHandler	Обработчик завершения изменения параметра
	 * @returns {SamsonJS}	Указатель на себя цепирования
	 */
	scrollPageTo: function( fValue, speed, finishHandler )
	{
		// Если нам передан объект, учтем его смещения и текущую прокрутку
		if( typeof( fValue ) == 'object' ) fValue = fValue.offset().top;		
		// Если конечное значение не передано - установим максимальное
		else if ( fValue == undefined ) fValue = s.pageScrollHeight();	
		
		// Правильный указатель на контейнер для прокрутки страницы
		var pageObj = s(document.documentElement);
		
		// Кроссбраузерное определение родительского объекта страницы и значения прокрутки
		if( !(document.documentElement && document.documentElement.scrollTop) ) 
		{
			pageObj = s(document.body);
			
			// Добавим текущую прокрутку страницы для правильного расчета координат
			fValue += s.pageScrollTop();
		}

		// Выполним анимацию проуркутки
		return pageObj.scrollTopTo( fValue, speed, finishHandler );
	},
	
	/**
	 * Выполнить анимированное сворачивание элемента
	 * @memberOf SamsonJS	
	 * @see SamsonJS:heightTo()
	 * @param {Number} 		fValue			Конечное значение параметра элемента	 
	 * @param {String} 		speed			Скорость изменения параметра
	 * @param {Function}	finishHandler	Обработчик завершения изменения параметра
	 * @returns {SamsonJS}	Указатель на себя цепирования
	 */
	collapse: function( speed, finishHandler )
	{	
		// Запишем текущую высоту элемента в специальный аттрибут
		this.a('collapsedHeight', this.height()); 
		
		// Выполним универсальный аниматор с указанием конкретного параметра
		return this.animate( 0, 'height', speed, finishHandler );	
	},
	
	/**
	 * Выполнить анимированное изменение высоты элемента
	 * @memberOf SamsonJS	
	 * @param {Number} 		fValue			Конечное значение параметра элемента	 
	 * @param {String} 		speed			Скорость изменения параметра
	 * @param {Function}	finishHandler	Обработчик завершения изменения параметра
	 * @returns {SamsonJS}		Указатель на себя цепирования
	 */
	expand: function( speed, finishHandler )
	{ 
		// Выполним универсальный аниматор с указанием конкретного параметра
		return this.animate( this.a('collapsedHeight'), 'height', speed, finishHandler );	
	},
});