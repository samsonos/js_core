/**
 * SamsonJS Draggable plugin
 * 
 * Расширение функционала JavaScript фреймоворка SamsonJS
 * для поддержки "перетаскивания" элементов DOM
 * 
 */
var SamsonJSDraggable = 
{
	/**
	 * Обработчик расширения функционала объекта SamsonJS
	 * метода по "перетаскиванию" его элемента DOM
	 * 
	 * @param options Объект параметры
	 */
	draggable : function( _options )
	{	
		// Указатель на самого себя
		var _self = this;	
		
		// Обезопасим переданные параметры работы плагина
		var options = _options || {};		
		
		// Контейнер внутри которого должен "перетаскиваться" текущий элемент DOM
		// Если ничего не передано - будем "перетаскиваться" по всему документу
		_self.imageContainer = SamsonJS( (options.container ? options.container : document.body) );
		
		// Получим координаты левого верхнего угла родительского контейнера по оси Х
		_self.parentLeft = _self.imageContainer.offset().left;
		// Получим координаты левого верхнего угла родительского контейнера по оси У
		_self.parentTop = _self.imageContainer.offset().top;
		// Получим размеры родительского контейнера
		_self.parentWidth = _self.imageContainer.width();
		// Получим размеры родительского контейнера
		_self.parentHeight = _self.imageContainer.height();		
		// Флаг начала "перетаскивания" элемента DOM
		_self.dragStarted = false;	
		// Координата X левого верхнего угла элемента DOM в абсолютной величине
		_self.dragCurrentLeft = _self.parentLeft || 0;
		// Координата Y левого верхнего угла элемента DOM в абсолютной величине
		_self.dragCurrentTop  = _self.parentTop || 0;
		// Координата X левого верхнего угла элемента DOM относительно родительского контейнера
		_self.relLeft = 0;
		// Координата Y левого верхнего угла элемента DOM относительно родительского контейнера
		_self.relTop = 0;
		// Установим текущую ширину элемента DOM
		_self.dragWidth = _self.parentWidth < _self.width() ? _self.parentWidth : _self.width();
		// Установим текущую высоту элемента DOM
		_self.dragHeight = _self.parentHeight < _self.height() ? _self.parentHeight : _self.height();
		// Установим специальный флаг что данный элемент DOM может "перетаскиваться"
		_self.isDraggable = true;		
		
		// Переместим данный элемент DOM левый верхний угол родительского элемента
		_self.left( _self.dragCurrentLeft + "px");
		_self.top( _self.dragCurrentTop + "px");
		
		// Установим "правильные" размеры элемента DOM
		_self.width( _self.dragWidth + "px" );
		_self.height( _self.dragHeight + "px" );
		
		/**
		 * Обновить параметры "перетягаваемого" объекта
		 * @param _options Объект параметры 
		 */
		_self.update = function( _options )
		{	
			// Сохраним старые параметр элемента DOM для того что бы избежать выполнения лишних действий
			var _oWidth = _self.dragWidth;
			var _oHeight = _self.dragHeight;
			
			// Установим текущюю ширину блока в следующем приоритете: переданное значение, текущее значение, базовое значение
			_self.dragWidth = (_options ? parseInt(_options.width) : (_self.width() || 200));
			
			// Установим текущюю высоту блока в следующем приоритете: переданное значение, текущее значение, базовое значение
			_self.dragHeight = (_options ? parseInt(_options.height) : (_self.height() || 200));
			
			// Установим текущюю координату Х левого верхнего угла элемента DOM 		
			_self.dragCurrentLeft = (_options ? parseInt(_options.left) : _self.dragCurrentLeft);
			
			// Установим текущюю координату Y левого верхнего угла элемента DOM 		
			_self.dragCurrentTop = (_options ? parseInt(_options.top) : _self.dragCurrentTop);
			
			// Рассчитаем положение координаты Х левого верхнего угла перемещаемого объекта относительно родительского контейнера 
			_self.relLeft = _self.left() - _self.parentLeft;
			
			// Рассчитаем положение координаты У левого верхнего угла перемещаемого объекта относительно родительского контейнера
			_self.relTop = _self.top() - _self.parentTop;
			
			// Установим ширину элемента DOM, если она изменилась
			if( _oWidth !== _self.dragWidth ) _self.width( _self.dragWidth + "px" );
			// Установим высоту элемента DOM, если она изменилась
			if( _oHeight !== _self.dragHeight ) _self.height( _self.dragHeight + "px" );
			
			// Если задан обработчик обновления статуса "перетаскиваемого" элемента DOM
			if( options.updateHandler ) options.updateHandler( _self );				
			
			s.trace(_self.relLeft);
			s.trace(_self.relTop);
		};
		
		/**
		 * Обработчик начала "перетаскивания" элемента DOM
		 * 
		 * @param draggedObject SamsonJS объект который пытаются начать двигать
		 * @param options Дополнительные параметры переданные через обработчик события
		 * @param event Объект описывающий событие
		 */
		_self.startDrag = function( draggedObject, options, event )
		{
			// Если объект может "перетаскиваться" и он еще не начал это делать, и нажата левая клавиша мыши
			if( draggedObject.isDraggable && !draggedObject.dragStarted && (event.which === 1)) 
			{
				// Установим флаг что объект уже начал "перетаскиваться"
				draggedObject.dragStarted = true;				
				// Установим начальное значение координаты Х левого верхнего угла 
				draggedObject.dragStartedX = event.clientX;
				// Установим начальное значение координаты У левого верхнего угла 
				draggedObject.dragStartedY = event.clientY;
				
				// Уберем все выделения в документе которые моги получится
				window.getSelection().removeAllRanges();
			}
		};
		
		/**
		 * Обработчик завершения "перетаскивания" элемента DOM
		 * 
		 * @param draggedObject SamsonJS объект который завершил движение
		 * @param options Дополнительные параметры переданные через обработчик события
		 * @param event Объект описывающий событие
		 */
		_self.stopDrag = function( draggedObject, options, event )
		{
			// Если была отпущена левая клавиша мыши, и объект находился в режиме "перетаскивания"
			if( (event.which === 1) && draggedObject.dragStarted )
			{
				// Установим флаг что объект уже завершил "перетаскиваться"
				draggedObject.dragStarted = false;				
				// Сохраним текущее значение координаты Х левого верхнего угла 
				draggedObject.dragCurrentLeft = draggedObject.left();				
				// Сохраним текущее значение координаты У левого верхнего угла
				draggedObject.dragCurrentTop = draggedObject.top();
			}
		};	
		
		/**
		 * Обработчик процесса "перетаскивания" элемента DOM
		 * 
		 * @param draggedObject SamsonJS объект который сейчас "перетаскивается"
		 * @param options Дополнительные параметры переданные через обработчик события
		 * @param event Объект описывающий событие
		 */
		_self.drag = function( draggedObject, options, event  )
		{
			// Если объект может "перетаскиваться" и он уже начал это делать
			if( draggedObject.isDraggable && draggedObject.dragStarted )
			{		
				// Рассчитаем смещение курсора мыши по оси Х относительно начала его передвижения
				var dx = event.clientX - draggedObject.dragStartedX;				
				// Рассчитаем смещение курсора мыши по оси У относительно начала его передвижения
				var dy = event.clientY - draggedObject.dragStartedY;
				
				// Выщитаем новое значение положения относительно текущего смещения по оси Х
				var newLeft = draggedObject.dragCurrentLeft + dx;				
				// Выщитаем новое значение положения относительно текущего смещения по оси У
				var newTop = draggedObject.dragCurrentTop + dy;
				
				// Если задан родительский "ограничивающий" контейнер
				if( draggedObject.imageContainer )
				{
					// Если "расчетное" значение левого верхнего угла по оси Х меньше чем у родительского
					// контейнера - прижмем к его левому краю
					if( newLeft <= draggedObject.parentLeft ) newLeft = draggedObject.parentLeft;
					// Если "расчетное" значение правого верхнего угла по оси Х больше чем у родительского
					// контейнера - прижмем к его правому краю
					else if( (newLeft + _self.dragWidth) >= (draggedObject.parentLeft + draggedObject.parentWidth) ) 
						newLeft = (draggedObject.parentLeft + draggedObject.parentWidth - _self.dragWidth);
					
					// Если "расчетное" значение левого верхнего угла по оси Y меньше чем у родительского
					// контейнера - прижмем к его верхнему краю
					if( newTop <= draggedObject.parentTop ) newTop = draggedObject.parentTop;
					// Если "расчетное" значение левого нижнего угла по оси Y больше чем у родительского
					// контейнера - прижмем к его нижнему краю
					else if( (newTop + _self.dragHeight) >= (draggedObject.parentTop + draggedObject.parentHeight) ) 
						newTop = (draggedObject.parentTop + draggedObject.parentHeight - _self.dragHeight);
				}				
				
				// Установим новое значение положения элемента DOM
				draggedObject.left( newLeft + "px" );
				draggedObject.top( newTop + "px" );	
		
				// Выполним обновление статуса объекта
				draggedObject.update();
			}
		};		
		
		// Повесим обработчики событий для мыши		
		// Повесим обработчик начала "перетаскивания" на нажатие клавиши мыши
		_self.mousedown( _self.startDrag );
		// Повесим обработчик процессав "перетаскивания" на передвижение клавиши мыши
		_self.mousemove( _self.drag );
		// Повесим обработчик завершения "перетаскивания" на отпускание клавиши мыши
		_self.mouseup( _self.stopDrag );
		// Повесим обработчик завершения "перетаскивания" на "уход" мыши с элемента DOM
		_self.mouseout( _self.stopDrag );
	}
};

//Добавим плагин к SamsonJS
SamsonJS.extend( SamsonJSDraggable );
