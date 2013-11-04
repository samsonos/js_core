/**
 * Samson JavaScript Framework
 * @author Vitaly Iegorov vitalyiegorov@gmail.com
 * @type SamsonJS 
 * @param {String} selector CSS селектор для получения элемента(ов) DOM
 * @param {SamsonJS} [parent] Родительский элемент SamsonJS в котором необходимо выполнить получение элемента(ов) DOM 
 * @returns {SamsonJS} Объект фреймворка
 */
var SamsonJS = (function(selector, parent) 
{		
	/**
	 * Внутренний объект-функция который создается для установки в него основных
	 * методов и свойств и возврата его экземпляра из главной функции
	 * window.SamsonJS()	
	 * 	 
	 * @param {String|SamsonJS} selector CSS селектор для получения элемента(ов) DOM
	 * @param {SamsonJS} 		[parent] Родительский элемент SamsonJS в котором необходимо выполнить получение элемента(ов) DOM
	 * @returns {SamsonJS} Объект фреймворка
	 */
	var SamsonJS = function( selector, parent) {
		// Создадим модифицированный объект ссылающийся сам на себя
		// как через свой прототип(описано ниже) так и через конструктор
		return new SamsonJS.fn.init(selector, parent);
	};
	
	/**
	 * Сокращении для доступа к прототипу фреймворка
	 */
	SamsonJS.fn = SamsonJS.prototype;// = new Array;

	/**
	 * Текущая версия фреймворка
	 */
	SamsonJS.version = '0.3.3';	
	
	/**
	 * Флаг вывода отладочных сообщений
	 */
	SamsonJS.debug = true;

	/**
	 * Инициализатор - будущий экземпляр данного объекта при вызове
	 * родительской функции		
	 * @constructor 
	 * @param {String|SamsonJS} selector Селектор для получения элемента DOM
	 * @returns {SamsonJS} Указатель на самого себя для цепирования		 
	 */	
	SamsonJS.fn.init = function( selector, parent )
	{
		/**
		 * Для начала определим к каким элементам DOM будет привязан текущий
		 * объект и запишем коллекцию этих элементов в this.elements
		 */	

		// Если нам хоть что-то передано
		if (selector) 
		{
			// Если нам передали уже существующий SamsonJS
			if ((typeof (selector) === 'object') && (selector instanceof SamsonJS)) {
				// Переберем все поля которые имеет переданный объект SamsonJS
				for ( var attr in selector) {
					// Если это поле принадлежит самому объекту - скопируем его значение
					if (selector.hasOwnProperty(attr)) this[attr] = selector[attr];
				}

				// Если у переданногор объекта есть выборка DOM
				if (selector.elements) 
				{
					// Очистим массив подчиненных элементов
					this.elements = [];

					// Скопируем элементы выборки DOM из переданного объекта в текущий
					for ( var i = 0; i < selector.elements.length; i++)
						this.elements[this.elements.length] = selector.elements[i].DOMElement;
				}

				// Получим селектор объекта дял сохранения дальнейшей логики работы функции инициализации объекта
				selector = selector.selector;

				// Дальше этот метод инициализации все сделает сам
			}
			// Попытаемся найти элементы в дереве DOM
			else this.elements = SamsonJS.fn.find(selector, parent);			

			// Если нам не удалось получить элементы DOM из дерева документа и передана строка
			if (this.elements === undefined) {
				/**
				 * Теперь МАГИЯ - дадим браузеру шанс создать DOM элементы
				 * самостоятельно, тоесть не важно что нам передали, браузер
				 * сам разберется что и как надо создать и если это у него
				 * выйдет то он насоздает в нашем "виртуальном" контейнере
				 * DIV все переданное в виде строки. А нам останется это
				 * перебрать и заполнить текущую выборку элементов DOM.
				 * 
				 * Если что-то не вышло то catch это поймает.
				 */

				// Попытаемся создать новый элемент DOM
				try {
					
					// Создадим временный контейнер DIV для заполнения
					newDOMElement = document.createElement('DIV');

					// Заполним временный контейнер DIV полученным HTML кодом
					newDOMElement.innerHTML = selector;

					// Коллекция элементов DOM для заполнения из переданно контента
					this.elements = [];

					// Переберем созданные браузером элементы DOM
					for ( var i = 0; i < newDOMElement.childNodes.length; i++) {
						// Добавим в коллекцию текущих элементов DOM новый "виртуальный" элемент
						this.elements[this.elements.length] = newDOMElement.childNodes[i];
					}
				} catch (e) {s.trace('Ошибка создания элемента DOM: '+ e.toString());}					
			}
		}
		
		/**
		 * Селектор по которому был создан данный объект
		 */
		this.selector = selector;

		// Установим количество элементов по умолчанию
		this.length = 0;

		// Если в текущей выборке есть элементы DOM
		if (this.elements && this.elements.length) 
		{
			/**
			 * Указатель на элемент DOM к которому привязан данный SamsonJS
			 * по умолчанию мы привязываем его к 1-му элементу полученной
			 * коллекции элементов DOM
			 */
			this.DOMElement = this.elements[0];				
		
			/**
			 * Сохраним количество элементов принадлежащих текущей выборки
			 */
			this.length = this.elements.length;
	
			// Замкнем коллекцию на себе же, мы нечего не потеряем т.к.сохранили привязанный элемент DOM в
			// отдельную переменную, но выполним это только тогда когда ввыборке DOM находится всего один
			// элемент, и данный объект фатически является "атомарным" - имеет наименьшее возможное количество
			// подчиненных узлов = 1, то есть ссылается сам на себя.
			if (this.length == 1) this.elements[0] = this;
			
			// Иначе, данный объект имеет несколько подчиненных элементов DOM и нам необходимо для каждого из них
			// создать свой собственный "атомарный" объект, и так делать бесконечно глубоко
			// Создадим коллекцию подчиненных SamsonJS для полученных элементов DOM из текущей выборки
			else for ( var i = 0; i < this.length; i++) this.elements[i] = new SamsonJS( this.elements[i], this );
		}
		// Обнулим указатель на коллекцию элементов DOM - объект пустой
		else this.elements = null;
	};
	
	/**
	 * Функция обертка для выборки элементов Пока что выбираем элементы
	 * используя JQuery, но в дальнейшем намерены переписать собственный
	 * метод. 
	 * @private
	 * @param 	{String} 	selector 	CSS селектор для выборки элементов DOM
	 * @param 	{SamsonJS} 	[_context] 	Контекст для выборки элементов DOM
	 * @returns {Array} Группу найденных объектов из дерева DOM
	 */
	SamsonJS.fn.find = function(_selector, _context)
	{
		// Если передан объект элемента DOM
		if (typeof _selector === 'object') return [ _selector ];
		// Иначе попытаемся выбрать элементы из дерева элементов DOM
		// документа по селектору
		// используя внешнюю библиотеку Sizzle
		else {
			try {
				// Если указан контекст для запроса
				if (_context && (_context instanceof SamsonJS)) 
				{
					// Соберем все элементы DOM сюда
					DOMElements = [];

					// Переберем все элементы из полученного контекста
					for ( var i = 0; i < _context.elements.length; i++) 
					{
						// Получим текущий элемент их выборки элементов DOM переданнгого контекста
						contextDOMElement = _context.elements[i].DOMElement;

						// Для фреймов как контекст передадим его "окно" для поиска
						if (contextDOMElement.tagName
								&& (contextDOMElement.tagName.toLowerCase() == 'iframe')
								&& contextDOMElement.contentDocument) {
							contextDOMElement = contextDOMElement.contentDocument;
						}

						// Выберем элементы DOM по селектору для каждого элемента из выборки переданного контекста
						// Сохраним результат выборки по текущему элементу из переданного контекста
						Sizzle(_selector, contextDOMElement, DOMElements);
					}

					// Вернем "собранную" коллекцию элементов DOM
					return DOMElements;
				}
				// Или просто общая выборка
				else return Sizzle(_selector);
			}
			// Обработаем ошибку в init()
			catch (e) {	/*s.trace('Sizzle не смог найти объект DOM по селектору: '+_selector);*/}
		}
	};
	
	/**
	 * Выполнить указанный обработчик над всеме элемента DOM из текущей
	 * выборки Функция может работать как в контексте текущего объекта
	 * используя текущую выборку элементов DOM
	 * 		  
	 * @author Vitaliy Egorov <vitalyiegorov@gmail.com>
	 * @memberOf SamsonJS
	 * 
	 * @param {Function} 	handler Функция обработчик для каждого элемента DOM из выборки		 
	 * @returns {SamsonJS} 	Указатель на самого себя для цепирования
	 */
	SamsonJS.fn.each = function( handler )
	{		
		// Указатель на самого себя
		var _self = this;

		// Если мы получили обработчик
		if (_self.elements && handler) 
		{
			// Переберем все элементы из коллекции DOM элементов и вызовем для каждого элемента переданный обработчик, передав
			// в него указатель на обрабатываемый объект
			for ( var index = 0; index < _self.elements.length; index++) handler( _self.elements[index] );
		}

		// Вернем самого себя
		return _self;		
	};	

	/**
	 * Главная функции для расширения функционала SamsonJS фреймворка
	 * <p>
	 * Функция принимает своим аргументом объект <code>{ funcName : function() { * ..code..}, ... }</code> 
	 * c описанными функциями и привязывает их глобальному объекта SamsonJS, 
	 * а так же к его прототипу. Что по сути и является расширением функционала фреймворка.
	 * </p>
	 * 
	 * @author Vitaliy Egorov <vitalyiegorov@gmail.com>
	 * @memberOf SamsonJS
	 */
	SamsonJS.extend = function() 
	{	
		// Указатель на объект для "расширения"		 
		target = arguments[0] || {};

		// Если этот аргемент функция
		if (typeof target == 'object') 
		{
			// Переберем поля переданного объекта и принимаем только функции		
			for (name in target) if (typeof target[name] == 'function')
			{
				// Добавим к SamsonJS и к его прототипу новую функцию по имени name
				SamsonJS[name] = SamsonJS.fn[name] = target[name];
			}
		}		
	};

	/**
	 * Вывести отладочное сообщение в консоль браузера.
	 * 
	 * <p>
	 * Функция проверяет поддержку вывода сообщений в консоль браузера во избежании ошибок
	 * и всегда возвращает значение <code>undefined</code>
	 * </p>
	 * 
	 * @author Vitaliy Egorov <vitalyiegorov@gmail.com>
	 * @memberOf SamsonJS
	 * 
	 * @param {String} 	text 	Текст сообщения	для вывода
	 * @param {Boolean} stack 	Выводить ли дерево вызовов  
	 * @returns {undefined} undefined Пустое значение 
	 */
	SamsonJS.trace = function(text, stack) 
	{
		// Если есть отладочная консоль и она поддерживается
		if( this.debug && window.console) 
		{
			console.log(text);
			
			// Если необходимо вывести стек вызовов
			if( stack && !s.IEVersionLowerThan(9)) console.trace();
		}
		
		// Всегда возвоащаем пустое значение
		return undefined;
	};	
	
	/**
	 * Связем прототипную функцию инициализации с общим прототипом что бы
	 * получить "замыкание" объекта самого в себе при вызове функции
	 */
	SamsonJS.fn.init.prototype = SamsonJS.fn;

	/**
	 * Вернем самого себя
	 */
	return SamsonJS;
})();

/** 
 * Получить экземппяр SamsonJS для статического контекста 
 */
var s = SamsonJS;

/** 
 * Получить экземппяр SamsonJS для динамического контекста 
 * @returns {SamsonJS} экземппяр SamsonJS 
 */
function s( selector, parent ){ return SamsonJS( selector, parent ); };

// Инициализируем фреймворк
(function(window)
{	
	// Сделать SamsonJS глобальным и привязать спецсимвол "_"
	window.SamsonJS = window.S = window.s = SamsonJS;
	
	// Сообщим всем что SamsonJS успешно загружен
	s.trace('Фреймворк SamsonJS '+SamsonJS.version+' - Успешно загружен в систему');
	
	// Предложения по работе
	s.trace('Нравится JavaScript, хочешь узнать много нового и зарабатывать на этом деньги? Пиши info@samsonos.com');
	
})(window); // Выполним привязку фреймворка к "окну" приложения