/**
 * SamsonJS UI Fader plugin
 * 
 * Расширение функционала JavaScript фреймоворка SamsonJS
 * Визуальный эффект - Плавное исчезание/появление
 * 
 */
SamsonJS.extend({ 
	/**
	 * Универсальный обработчик анимирования плавного "скрытия" или "проявления" элемента
	 * @param currentTick 	Текущий кадр анимации
	 * @param totalTicks	Общее количество кадров анимации
	 * @param speed			Скорость изменения кадров( кадр/мс)
	 * @param elm			Текущий элемент над которым выполняется анимация
	 * @param handler		Обработчик завершения анимации
	 */
	_fadeAnimation : function( currentTick, totalTicks, speed, elm, handler )
	{	
		//s.trace('_fadeAnimation: Starting('+currentTick+','+totalTicks+','+speed+')');
		
		// Временная переменная для расчета
		var _speed = speed;	
		
		// Проверим номер шага анимации
		if( ((_speed > 0) && (currentTick <= totalTicks)) || ((_speed < 0) && (currentTick >= 0)) )
		{				
			// Рассчитаем новое значение прозрачности элемента
			var newOpVal = Math.abs( currentTick / totalTicks );				
			
			// Установим прозрачность элемента (для IE)
			if(s.IEVersionLowerThan(9)) elm.css('filter', ' alpha(opacity = ' + (newOpVal*100) + ')');
			// Установим прозрачность элемента
			else elm.css('opacity', newOpVal );
			  
			// Запустим таймер на выполнение анимации
			setTimeout( function(){ elm._fadeAnimation( currentTick + _speed, totalTicks, speed, elm, handler ); }, 33 );
		}
		// Завершили анимацию
		else
		{
			// Определим последнее значение прозрачности элемента
			var endOpVal = _speed > 0 ? 1.0 : 0.0;
			
			// Установим прозрачность элемента (для IE)
			if(s.IEVersionLowerThan(9)) elm.css('filter', 'alpha(opacity = ' + (endOpVal*100) + ')');
			// Установим прозрачность элемента
			else elm.css('opacity', endOpVal );
			
			// Если передан обработчик завершения анимации
			if( handler ) handler( elm );
		}
	},

	/**
	 * Плавно "проявить" элемент из темноты
	 * @memberOf SamsonJS
	 * @param speed			Скорость проявления
	 * @param finishHandler	Обработчик завершения анимации 
	 */
	fadeIn : function( speed, finishHandler )
	{			
		// Определим скорость анимации
		switch( speed )
		{
			case 'slow'		: speed = 40; break;
			case 'fast'		: speed = 90; break;
			case undefined	: speed = 65;
		}	
		
		// Вернем самого себя
		return this.each(function(obj)
		{							
			// Покажем объект
			obj.show();
			
			// Установим прозрачность элемента
			obj.css('opacity', 0.0 );
			
			// Выполним анимацию
			obj._fadeAnimation( 0, 1000, speed, obj, function( obj )
			{
				// Установим прозрачность элемента (для IE)
				obj.css('opacity', '');
				
				// Обработчик завершения анимации
				if( finishHandler ) finishHandler( obj );
			});		
		});		
	},
	
	/**
	 * Плавно "скрыть" элемент в темноту
	 * @memberOf SamsonJS
	 * @param speed			Скорость скрытия
	 * @param finishHandler	Обработчик завершения анимации 
	 */
	fadeOut : function( speed, finishHandler  )
	{
		// Определим скорость анимации
		switch( speed )
		{
			case 'slow'	: speed = 40; break;
			case 'fast'	: speed = 90; break;
			case undefined	: speed = 65;
		}		
		
		// Вернем самого себя
		return this.each(function(obj)
		{
			// Выполним анимацию
			obj._fadeAnimation( 1000, 1000, -speed, obj, function( obj )
			{
				// Спрячем объект
				obj.hide();
				
				// Установим прозрачность элемента (для IE)
				obj.css('opacity', '');
				
				// Обработчик завершения анимации
				if( finishHandler ) finishHandler( obj );
			});		
		});		
	}
});
