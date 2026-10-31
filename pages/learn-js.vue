<template>
  <div class="learn-js max-w-6xl mx-auto">
    <div class="bg-white rounded-lg shadow-md p-6 mb-4">
      <h1 class="text-3xl font-semibold mb-2">Учим JS с нуля</h1>
      <p class="text-gray-600 mb-3">
        Каждый урок — вкладка. Сначала читай блок «Теория» на этой вкладке, потом пиши функции внизу файла.
        Результат задачи стоит справа в её карточке. Старые решения не удаляем: это история.
      </p>
      <p class="text-gray-600 mb-4 text-sm">
        Сейчас четыре темы: значения и функции, массивы и циклы, объекты, методы массива.
        Тема пройдена, когда счётчик на вкладке полный: зелёные все проверки, не «пять штук».
        Задач столько, сколько в теме разных приёмов. Мидл начинается, когда эти четыре уже в пальцах.
        Дальше пойдут функции как значения глубже, асинхронность и то, как Vue вызывает твой JS.
      </p>
      <div class="flex flex-wrap gap-2" role="tablist" aria-label="Уроки">
        <button
          v-for="lesson in lessons"
          :key="lesson.id"
          type="button"
          role="tab"
          class="px-4 py-2 rounded-md text-sm border transition-colors"
          :class="activeLessonId === lesson.id
            ? 'bg-amber-600 text-white border-amber-600'
            : 'bg-white text-gray-800 border-gray-200 hover:border-amber-300'"
          :aria-selected="activeLessonId === lesson.id"
          @click="activeLessonId = lesson.id"
        >
          Урок {{ lesson.id }}
          <span class="opacity-80">· {{ passedByLesson[lesson.id] }}/{{ checksByLesson[lesson.id].length }}</span>
        </button>
      </div>
    </div>

    <!-- Урок 1 -->
    <div v-show="activeLessonId === 1" class="space-y-6">
      <section class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-2">Значения, переменные, функции</h2>
        <p class="text-gray-600">
          JavaScript считает и принимает решения в браузере. Vue — оболочка:
          кнопка в template, логика — обычные JS-функции.
        </p>
      </section>

      <section class="bg-white rounded-lg shadow-md p-6 space-y-6">
        <h2 class="text-2xl font-semibold">Теория</h2>
        <p class="text-gray-600">
          Этот урок — словарь, без которого задачи ниже выглядят как «ты уже должен уметь».
          Прочитай его целиком, потом смотри свои функции <code>sum</code>, <code>isAdult</code>, <code>formatGreeting</code>:
          они как раз про эти правила.
        </p>

        <div>
          <h3 class="text-lg font-medium mb-2">1. Программа выполняет шаги сверху вниз</h3>
          <p class="text-gray-700 mb-2">
            JavaScript в браузере — это список команд. Движок читает строку, выполняет её, переходит к следующей.
            Vue рисует кнопки и инпуты. Расчёт «сколько будет», «взрослый ли», «какую строку показать» — обычный JS,
            тот же, что в этом файле ниже, в <code>&lt;script&gt;</code>.
          </p>
          <p class="text-gray-700">
            Команда бывает двух видов. Выражение имеет результат: <code>2 + 3</code> даёт <code>5</code>.
            Инструкция делает шаг: <code>return 5</code> отдаёт результат наружу и выходит из функции.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">2. Значение и тип</h3>
          <p class="text-gray-700 mb-2">
            Всё, с чем работает язык, — значение. У значения есть тип. Тип говорит, какие операции имеют смысл:
            числа складывают, текст склеивают, boolean отвечает «да» или «нет».
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li>
              <code>number</code> — любое число: <code>18</code>, <code>3.14</code>, <code>-1</code>.
              Отдельного типа «целое» нет. <code>10 / 4</code> даёт <code>2.5</code>.
            </li>
            <li>
              <code>string</code> — текст в кавычках. <code>'Аня'</code> и <code>"Аня"</code> — одно и то же.
              Шаблонная строка в обратных кавычках подставляет значение: <code>`Привет, ${name}!`</code>.
              Если <code>name</code> это <code>'Аня'</code>, результат — <code>Привет, Аня!</code>.
            </li>
            <li>
              <code>boolean</code> — ровно два значения: <code>true</code> и <code>false</code>.
              Сравнение само возвращает boolean: выражение <code>age &gt;= 18</code> уже равно <code>true</code> или <code>false</code>.
            </li>
            <li>
              <code>undefined</code> значит «значения нет». Функция без <code>return</code> отдаёт <code>undefined</code>.
              Чтение поля, которого нет, тоже даёт <code>undefined</code>. Это не ошибка, страница просто показывает пустоту.
            </li>
            <li>
              <code>null</code> значит «пусто поставили специально». В задачах этого урока его нет.
              Запомни разницу: <code>undefined</code> язык ставит сам, <code>null</code> пишет программист.
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">3. Переменная — имя для значения</h3>
          <p class="text-gray-700 mb-2">
            <code>=</code> в JS — это «положи значение в коробку с этим именем», а не знак равенства из тетради.
            Слева имя, справа то, что кладём.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">const age = 20
let title = 'ученик'
title = 'джун'</pre>
          <ul class="list-disc list-inside text-gray-700 space-y-1 mt-2">
            <li><code>const</code> — имя навсегда связано с этим значением. <code>age = 21</code> после <code>const age</code> язык запретит.</li>
            <li><code>let</code> — в ту же коробку можно положить новое значение. Сумма в цикле живёт в <code>let</code>, потому что она растёт.</li>
            <li>Имя видно внутри функции, где его объявили. Снаружи этой функции коробки нет.</li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">4. Операторы: что они возвращают</h3>
          <p class="text-gray-700 mb-2">
            Оператор берёт значения и отдаёт новое значение. Это и есть результат, который можно вернуть из функции.
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-1">
            <li><code>+</code> <code>-</code> <code>*</code> <code>/</code> — арифметика. <code>2 + 3</code> равно <code>5</code>.</li>
            <li><code>%</code> — остаток от деления. <code>7 % 2</code> равно <code>1</code>, <code>8 % 2</code> равно <code>0</code>. На следующем уроке так отличают чётные.</li>
            <li>У строк <code>+</code> склеивает: <code>'Привет, ' + 'Аня' + '!'</code> даёт <code>Привет, Аня!</code>.</li>
            <li>
              Сравнения <code>===</code> <code>!==</code> <code>&gt;</code> <code>&lt;</code> <code>&gt;=</code> <code>&lt;=</code> возвращают boolean.
              <code>18 &gt;= 18</code> это <code>true</code>. <code>17 &gt;= 18</code> это <code>false</code>.
            </li>
            <li>
              Пиши <code>===</code>. Он сравнивает и значение, и тип: <code>18 === '18'</code> это <code>false</code>,
              потому что число и строка — разные типы. <code>==</code> сначала приводит типы и из-за этого путает.
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">5. Функция: вход, тело, выход</h3>
          <p class="text-gray-700 mb-2">
            Функция — кусок кода с именем. Её вызывают много раз с разными входами.
            Параметры — временные коробки на один вызов. <code>return</code> — что функция отдаёт тому, кто её вызвал.
            Строки после <code>return</code> уже не выполняются: функция вышла.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">function double(n) {
  return n * 2
}

double(4)   // вызов. n на этот раз равен 4. результат 8
double(10)  // новый вызов. n равен 10. результат 20</pre>
          <p class="text-gray-700 mt-2">
            Если <code>return</code> нет, результат вызова — <code>undefined</code>.
            Проверка на странице как раз сравнивает то, что вернула функция, с ожидаемым числом или строкой.
            Пока стоит <code>return undefined</code>, тест красный: ждали конкретный ответ, получили «значения нет».
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">6. if выбирает ветку</h3>
          <p class="text-gray-700 mb-2">
            <code>if</code> выполняет блок, только когда условие равно <code>true</code>.
            Условие — это выражение, которое само даёт boolean.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">function isWarm(temp) {
  if (temp &gt;= 20) {
    return true
  }
  return false
}</pre>
          <p class="text-gray-700 mt-2">
            Вторая строка <code>return false</code> выполняется, только если первая ветка не сработала.
            Тот же смысл короче: <code>return temp &gt;= 20</code>. Сравнение уже boolean, отдельный
            <code>if</code> и тернарник <code>условие ? true : false</code> повторяют то, что язык уже посчитал.
          </p>
          <p class="text-gray-700 mt-2">
            <code>if (age)</code> — это вопрос «age не пустое?», а не «age больше или равен 18?».
            Ноль для <code>if</code> выглядит как «нет». Возраст 0 тогда ошибочно станет «не взрослый» по другой причине.
            Сравнение пиши явно: <code>age &gt;= 18</code>.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">7. Несколько веток: if друг за другом</h3>
          <p class="text-gray-700 mb-2">
            Когда ответов больше двух, проверки ставят от более узкой к более широкой.
            Сработала первая истинная ветка — функция выходит через <code>return</code>, нижние строки не читаются.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">function ticket(age) {
  if (age &lt; 6) return 'бесплатно'
  if (age &lt; 18) return 'детский'
  return 'взрослый'
}</pre>
          <p class="text-gray-700 mt-2">
            Возраст 4 попадает в первую ветку. Возраст 10 не проходит <code>age &lt; 6</code> и попадает во вторую.
            Возраст 20 не проходит обе и доходит до последнего <code>return</code>.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">8. Какой приём в какой задаче</h3>
          <p class="text-gray-700">
            Первые три ты уже написал: сложение, сравнение в boolean, шаблонная строка.
            Дальше по одной задаче на остальное из этого урока: умножение, вычитание, остаток,
            строгое <code>===</code> (число и строка с теми же цифрами — разные значения),
            склейка строк плюсом, цепочка <code>if</code>, выбор большего из двух чисел,
            деление, которое при нуле в знаменателе возвращает <code>undefined</code>.
          </p>
        </div>
      </section>

      <section class="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 class="text-2xl font-semibold">Задачи</h2>
        <p class="text-gray-600">
          В заголовке — имя функции внизу файла, в блоке этого урока.
          Слова в скобках — аргументы: значения, которые функции передают при вызове.
          Это имена в коде, не отдельные команды. Если справа всё зелёное, функцию не переписывай.
        </p>
        <LearnTask :checks="checksFor(1, 'sum')">
          <h3 class="font-medium mb-2">1. <code>sum(a, b)</code></h3>
          <p class="text-gray-700">
            Функция <code>sum</code>. Ей передают два числа, в коде они называются <code>a</code> и <code>b</code>.
            Верни одно число — их сумму. <code>sum(2, 3)</code> должно вернуть <code>5</code>,
            <code>sum(10, -4)</code> — <code>6</code>.
          </p>
        </LearnTask>
        <LearnTask :checks="checksFor(1, 'isAdult')">
          <h3 class="font-medium mb-2">2. <code>isAdult(age)</code></h3>
          <p class="text-gray-700">
            Функция <code>isAdult</code>. Ей передают одно число — возраст, в коде оно называется <code>age</code>.
            Верни <code>true</code>, если возраст 18 или больше, и <code>false</code>, если меньше.
            Нужен ответ «да» или «нет», не число.
          </p>
        </LearnTask>
        <LearnTask :checks="checksFor(1, 'formatGreeting')">
          <h3 class="font-medium mb-2">3. <code>formatGreeting(name)</code></h3>
          <p class="text-gray-700">
            Функция <code>formatGreeting</code>. Ей передают имя текстом, в коде оно называется <code>name</code>.
            Собери строку: слово «Привет», запятая, пробел, это имя и восклицательный знак.
            Для имени <code>Аня</code> строка должна быть ровно <code>Привет, Аня!</code>.
          </p>
        </LearnTask>
        <LearnTask :checks="checksFor(1, 'product')">
          <h3 class="font-medium">4. Умножь два числа — <code>product(a, b)</code></h3>
          <p class="text-gray-700">
            Функция <code>product</code>. Здесь это имя значит «произведение», результат умножения.
            Это не товар и не цены из урока 3. Ей передают два числа <code>a</code> и <code>b</code>.
            Верни первое, умноженное на второе. <code>product(2, 3)</code> → <code>6</code>.
            <code>product(10, -1)</code> → <code>-10</code>.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Верни <code>a * b</code>.</p>
          </details>
        </LearnTask>
        <LearnTask :checks="checksFor(1, 'subtract')">
          <h3 class="font-medium">5. Вычти второе из первого — <code>subtract(a, b)</code></h3>
          <p class="text-gray-700">
            Функция <code>subtract</code>. Два числа <code>a</code> и <code>b</code>.
            Верни первое минус второе. <code>subtract(10, 4)</code> → <code>6</code>.
            <code>subtract(3, 10)</code> → <code>-7</code>: из 3 вычли 10.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Верни <code>a - b</code>.</p>
          </details>
        </LearnTask>
        <LearnTask :checks="checksFor(1, 'remainder')">
          <h3 class="font-medium">6. Остаток от деления — <code>remainder(a, b)</code></h3>
          <p class="text-gray-700">
            Функция <code>remainder</code>. Два числа <code>a</code> и <code>b</code>.
            Верни остаток от деления первого на второе.
            <code>remainder(7, 2)</code> → <code>1</code>, потому что 7 = 2 × 3 + 1.
            <code>remainder(8, 2)</code> → <code>0</code>: делится без остатка.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Верни <code>a % b</code>.</p>
          </details>
        </LearnTask>
        <LearnTask :checks="checksFor(1, 'isSame')">
          <h3 class="font-medium">7. Это одно и то же значение? — <code>isSame(a, b)</code></h3>
          <p class="text-gray-700">
            Функция <code>isSame</code>. Два значения <code>a</code> и <code>b</code>.
            Верни <code>true</code>, только если это одно и то же значение и одного типа.
            <code>isSame(18, 18)</code> → <code>true</code>. <code>isSame('Аня', 'Аня')</code> → <code>true</code>.
            <code>isSame(18, '18')</code> → <code>false</code>: слева число, справа текст из тех же цифр.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Верни <code>a === b</code>. Двойное равно здесь не подходит: оно сочло бы число 18 и строку <code>'18'</code> одинаковыми.</p>
          </details>
        </LearnTask>
        <LearnTask :checks="checksFor(1, 'joinWithSpace')">
          <h3 class="font-medium">8. Склей два слова плюсом — <code>joinWithSpace(left, right)</code></h3>
          <p class="text-gray-700">
            Функция <code>joinWithSpace</code>. Две строки: <code>left</code> и <code>right</code>.
            Верни их через один пробел. <code>joinWithSpace('Аня', 'Ким')</code> → <code>Аня Ким</code>.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2"><code>left + ' ' + right</code>. Пробел — отдельная строка <code>' '</code>.</p>
          </details>
        </LearnTask>
        <LearnTask :checks="checksFor(1, 'describeHeat')">
          <h3 class="font-medium">9. Назови жару словами — <code>describeHeat(temp)</code></h3>
          <p class="text-gray-700">
            Функция <code>describeHeat</code>. Ей дают температуру числом, в коде она называется <code>temp</code>.
            Верни одно слово: <code>жарко</code>, если 30 или выше; <code>тепло</code>, если от 20 включительно и ниже 30;
            <code>прохладно</code>, если ниже 20. Примеры: 35 → <code>жарко</code>, 20 → <code>тепло</code>, 19 → <code>прохладно</code>.
            Сначала проверяй границу 30. Число 35 больше и 30, и 20, но слово должно быть «жарко».
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <ol class="list-decimal list-inside mt-2 space-y-1">
              <li>Если <code>temp &gt;= 30</code>, верни <code>'жарко'</code>.</li>
              <li>Если <code>temp &gt;= 20</code>, верни <code>'тепло'</code>.</li>
              <li>Иначе верни <code>'прохладно'</code>.</li>
            </ol>
          </details>
        </LearnTask>
        <LearnTask :checks="checksFor(1, 'larger')">
          <h3 class="font-medium">10. Какое из двух больше — <code>larger(a, b)</code></h3>
          <p class="text-gray-700">
            Функция <code>larger</code>. Два числа <code>a</code> и <code>b</code>.
            Верни то, которое больше, само число, не «да» и не «нет».
            <code>larger(3, 9)</code> → <code>9</code>. <code>larger(-1, -5)</code> → <code>-1</code>.
            Если числа равны, верни любое: <code>larger(4, 4)</code> → <code>4</code>.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Если <code>a &gt;= b</code>, верни <code>a</code>. Иначе верни <code>b</code>.</p>
          </details>
        </LearnTask>
        <LearnTask :checks="checksFor(1, 'divideSafe')">
          <h3 class="font-medium">11. Раздели, но не на ноль — <code>divideSafe(a, b)</code></h3>
          <p class="text-gray-700">
            Функция <code>divideSafe</code>. Два числа <code>a</code> и <code>b</code>.
            Верни первое, делённое на второе. <code>divideSafe(10, 2)</code> → <code>5</code>.
            <code>divideSafe(7, 2)</code> → <code>3.5</code>.
            Если второе число равно 0, делить нельзя: верни <code>undefined</code>, это «ответа нет».
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Если <code>b === 0</code>, сразу верни <code>undefined</code>. Иначе верни <code>a / b</code>.</p>
          </details>
        </LearnTask>
      </section>

    </div>

    <!-- Урок 2 -->
    <div v-show="activeLessonId === 2" class="space-y-6">
      <section class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-2">Массивы и циклы</h2>
        <p class="text-gray-600">
          Список покупок, строки таблицы, ответы API — массивы. Цикл проходит каждый элемент
          без ручного <code>items[0]</code>, <code>items[1]</code>.
        </p>
      </section>

      <section class="bg-white rounded-lg shadow-md p-6 space-y-6">
        <h2 class="text-2xl font-semibold">Теория</h2>
        <p class="text-gray-600">
          Здесь появляются три разных цикла. Их легко перепутать, потому что все начинаются со слова <code>for</code>.
          У каждого своя работа: один даёт номер, второй — значение, третий — имя поля.
          В <code>maxOf</code> ты взял третий. Тест прошёл, а смысл цикла был другой. Ниже — почему.
        </p>

        <div>
          <h3 class="text-lg font-medium mb-2">1. Зачем массив, если есть переменные</h3>
          <p class="text-gray-700">
            Одна цена живёт в <code>const price = 10</code>. Десять цен не стоит раскладывать в
            <code>price1</code>, <code>price2</code>, …: длина заранее неизвестна, её присылает сервер.
            Массив — один список значений одного вида. Порядок важен: первый элемент, второй, последний.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">2. Индекс с нуля и длина</h3>
          <p class="text-gray-700 mb-2">
            Номер элемента называется индекс. Первый слот — <code>0</code>, потому что отсчёт идёт от начала списка,
            а не от единицы, как в обычной речи «первый человек».
            <code>length</code> — сколько слотов занято. Это количество, а не номер последнего.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">const items = [10, 20, 30]
items[0]                 // 10  — первый
items[1]                 // 20
items[2]                 // 30  — последний
items.length             // 3   — три штуки
items[items.length - 1]  // 30  — номер последнего = длина минус 1
items[3]                 // undefined — слота с номером 3 нет, слоты 0, 1, 2</pre>
          <p class="text-gray-700 mt-2">
            Пустой список <code>[]</code> имеет <code>length === 0</code>. Читать <code>items[0]</code> некого:
            результат <code>undefined</code>. Формула «последний = длина − 1» у пустого списка даёт индекс <code>-1</code>,
            такого слота тоже нет, снова <code>undefined</code>.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">3. Цикл нужен, когда длина неизвестна</h3>
          <p class="text-gray-700">
            Написать <code>items[0] + items[1] + items[2]</code> можно только если элементов ровно три.
            Пришёл список из 100 чисел — эта строка сломается или пропустит хвост.
            Цикл повторяет один и тот же шаг, пока элементы не кончатся. Сколько их — решает <code>length</code> или сам список.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">4. Обычный for — когда нужен номер</h3>
          <p class="text-gray-700 mb-2">
            Три части в скобках: с чего начать, пока какое условие крутить, что сделать после каждого круга.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">for (let i = 0; i &lt; items.length; i = i + 1) {
  const item = items[i]
}</pre>
          <ul class="list-disc list-inside text-gray-700 space-y-1 mt-2">
            <li><code>let i = 0</code> — стартуем с первого слота. <code>i</code> меняется, поэтому <code>let</code>.</li>
            <li><code>i &lt; items.length</code> — крутим, пока номер меньше количества. Когда <code>i</code> дойдёт до <code>3</code> у списка из трёх, круг не начнётся.</li>
            <li><code>i = i + 1</code> — после круга номер растёт на 1. Иначе условие вечно истинно и страница зависнет.</li>
            <li><code>items[i]</code> — значение по этому номеру. <code>i</code> и значение — разные вещи.</li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">5. for...of — значения списка</h3>
          <p class="text-gray-700 mb-2">
            Если номер не нужен, а нужно само число, бери <code>for...of</code>.
            Переменная слева на каждом круге равна очередному элементу.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">const numbers = [3, 9, 1]

for (const n of numbers) {
  // круг 1: n === 3
  // круг 2: n === 9
  // круг 3: n === 1
}</pre>
          <p class="text-gray-700 mt-2">
            Сумма, подсчёт чётных и поиск максимума номера не требуют. Для них хватает <code>for...of</code>.
            Индекс из этого цикла сам не достаётся: его нет в переменной <code>n</code>.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">6. for...in — имена полей, не значения</h3>
          <p class="text-gray-700 mb-2">
            <code>for...in</code> перебирает имена полей объекта. Массив внутри тоже объект:
            его поля называются <code>"0"</code>, <code>"1"</code>, <code>"2"</code>. Поэтому переменная цикла — строка-номер, а не число из списка.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">const numbers = [3, 9, 1]

for (const n in numbers) {
  // круг 1: n === "0"    numbers[n] === 3
  // круг 2: n === "1"    numbers[n] === 9
  // круг 3: n === "2"    numbers[n] === 1
}</pre>
          <p class="text-gray-700 mt-2">
            В твоём <code>maxOf</code> написано <code>for (const n in numbers)</code> и дальше <code>numbers[n]</code>.
            Сравнение идёт по значению из слота, поэтому максимум <code>9</code> находится и тест зелёный.
            Сама переменная <code>n</code> при этом — строка <code>"0"</code>, не число <code>3</code>.
          </p>
          <p class="text-gray-700 mt-2">
            Если сравнить сами <code>n</code>, сравниваются строки посимвольно.
            <code>"2" &gt; "10"</code> даёт <code>true</code>, потому что символ <code>"2"</code> больше символа <code>"1"</code>.
            Для оценок это неверный порядок. Правило на этом уроке: по числам внутри массива ходи через <code>for...of</code>.
            <code>for...in</code> оставляй для полей объекта — это урок 3.
          </p>
          <p class="text-gray-700 mt-2">
            Коротко, какой цикл брать:
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-1">
            <li>нужны значения массива — <code>for...of</code></li>
            <li>нужен номер слота — обычный <code>for</code> с <code>i</code></li>
            <li>нужны имена полей объекта — <code>for...in</code></li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">7. Накопитель живёт снаружи цикла</h3>
          <p class="text-gray-700 mb-2">
            Сумма и счётчик — это <code>let</code> до цикла. Внутри круга ты меняешь одну и ту же коробку.
            Если объявить <code>let total = 0</code> внутри цикла, каждый круг создаёт новую коробку с нулём, прошлая сумма выбрасывается.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">let total = 0
for (const n of numbers) {
  total = total + n
}
return total</pre>
          <p class="text-gray-700 mt-2">
            Пустой список: цикл не делает ни одного круга, <code>total</code> так и остаётся <code>0</code>.
            Сложить нечего — ноль честный ответ. Для максимума ноль честным не будет:
            в списке <code>[-5, -1]</code> ноль больше обоих чисел, хотя в списке его нет.
            Поэтому у пустого списка максимума нет, функция возвращает <code>undefined</code>.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">8. Чётность через остаток</h3>
          <p class="text-gray-700">
            Чётное число делится на 2 без остатка. <code>n % 2 === 0</code> — это вопрос «остаток ноль?».
            <code>4 % 2</code> равно <code>0</code>, <code>5 % 2</code> равно <code>1</code>.
            Счётчик чётных прибавляет <code>1</code>, а не само число: в <code>[1, 2, 3, 4, 10]</code> ответ <code>3</code>, не <code>16</code>.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">9. Новый список собирают пустым и дописывают</h3>
          <p class="text-gray-700 mb-2">
            Цикл может не только считать, но и собрать другой массив. Начинаешь с пустого <code>[]</code>,
            подходящие числа кладёшь в конец методом <code>push</code>. Исходный список при этом не меняется.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">const big = []
for (const n of [4, 12, 8, 30]) {
  if (n &gt; 10) big.push(n)
}
// big — это [12, 30], порядок как в исходном списке</pre>
          <p class="text-gray-700 mt-2">
            <code>push</code> добавляет в хвост. Пустой исходный список не сделает ни одного круга, новый список останется <code>[]</code>.
          </p>
        </div>
      </section>

      <section class="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 class="text-2xl font-semibold">Задачи</h2>
        <p class="text-gray-600">
          В заголовке — имя функции внизу файла. Слова в скобках — аргументы, это имена в коде.
          Если справа всё зелёное, функцию не переписывай.
          Разбор под «Как это написать» открывай, только если после теории неясно, что вернуть.
        </p>

        <LearnTask :checks="checksFor(2, 'getFirst')">
          <h3 class="font-medium mb-2">1. Достань первое число — уже сделано</h3>
          <p class="text-gray-700">
            Функция <code>getFirst</code>. Ей дают список чисел, в коде он называется <code>items</code>.
            Пример: <code>[10, 20, 30]</code>. Верни первое число, <code>10</code>.
            Если список пустой <code>[]</code>, первого числа нет — верни <code>undefined</code>.
          </p>
        </LearnTask>

        <LearnTask :checks="checksFor(2, 'sumList')">
          <h3 class="font-medium">2. Сложи все числа из списка — уже сделано</h3>
          <p class="text-gray-700">
            Функция <code>sumList</code>. Список чисел называется <code>numbers</code>.
            Сложи все числа и верни сумму. <code>[1, 2, 3]</code> → <code>6</code>.
            Пустой список: складывать нечего, верни <code>0</code>.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <ol class="list-decimal list-inside mt-2 space-y-1">
              <li><code>let total = 0</code> — сумма, которую можно менять.</li>
              <li><code>for (const n of numbers)</code> — <code>n</code> это очередное число.</li>
              <li>Внутри: <code>total = total + n</code>.</li>
              <li><code>return total</code>.</li>
            </ol>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(2, 'countEven')">
          <h3 class="font-medium">3. Посчитай, сколько чисел чётные — уже сделано</h3>
          <p class="text-gray-700">
            Функция <code>countEven</code>. Список чисел <code>numbers</code>.
            Посчитай, сколько среди них чётных, и верни это количество, не их сумму.
            В <code>[1, 2, 3, 4, 10]</code> чётные 2, 4 и 10, ответ <code>3</code>.
            Если чётных нет — <code>0</code>.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <ol class="list-decimal list-inside mt-2 space-y-1">
              <li><code>let count = 0</code> — пока ни одного чётного.</li>
              <li>Пройди <code>for (const n of numbers)</code>.</li>
              <li>Если <code>n % 2 === 0</code>, сделай <code>count = count + 1</code>. Нечётное пропусти.</li>
              <li><code>return count</code>.</li>
            </ol>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(2, 'getLast')">
          <h3 class="font-medium">4. Достань последнее число</h3>
          <p class="text-gray-700">
            Функция <code>getLast</code>. Список чисел <code>items</code>. Верни последнее.
            <code>[10, 20, 30]</code> → <code>30</code>. В списке из одного числа <code>[7]</code> оно и есть последнее.
            Пустой список → <code>undefined</code>.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">
              Номера идут с нуля, поэтому последний номер — это длина минус один:
              <code>items[items.length - 1]</code>.
              Сначала проверь пустой список, иначе у пустого списка такого номера нет.
            </p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(2, 'maxOf')">
          <h3 class="font-medium">5. Найди самое большое число</h3>
          <p class="text-gray-700">
            Функция <code>maxOf</code>. Список чисел <code>numbers</code>. Верни самое большое.
            <code>[3, 9, 1]</code> → <code>9</code>. Среди отрицательных тоже есть большее:
            в <code>[-5, -1, -8]</code> это <code>-1</code>, оно ближе к нулю.
            Пустой список → <code>undefined</code>, сравнивать нечего.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <ol class="list-decimal list-inside mt-2 space-y-1">
              <li>Если список пустой — верни <code>undefined</code> сразу.</li>
              <li>Иначе запомни первое число: <code>let biggest = numbers[0]</code>.</li>
              <li>Пройди по остальным. Если <code>n &gt; biggest</code>, замени <code>biggest</code> на <code>n</code>.</li>
              <li><code>return biggest</code>.</li>
            </ol>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(2, 'minOf')">
          <h3 class="font-medium">6. Найди самое маленькое число — <code>minOf</code></h3>
          <p class="text-gray-700">
            Функция <code>minOf</code>. Тот же список чисел <code>numbers</code>. Верни самое маленькое.
            <code>[3, 9, 1]</code> → <code>1</code>. В <code>[-5, -1, -8]</code> самое маленькое <code>-8</code>.
            Пустой список → <code>undefined</code>.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Как максимум, только сравнение <code>n &lt; smallest</code>. Пустой список верни сразу.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(2, 'countGreater')">
          <h3 class="font-medium">7. Сколько чисел строго больше порога — <code>countGreater</code></h3>
          <p class="text-gray-700">
            Функция <code>countGreater</code>. Два аргумента.
            Первый — список чисел <code>numbers</code>. Второй — число <code>limit</code>, порог: «больше какого числа считать».
            Верни, сколько чисел в списке строго больше порога.
            <code>countGreater([1, 5, 8, 3], 4)</code> → <code>2</code>, это 5 и 8. Число, равное порогу, не считается.
            Если таких нет или список пустой — <code>0</code>.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2"><code>let count = 0</code> до цикла. Внутри <code>for...of</code>, если <code>n &gt; limit</code>, прибавь 1 к счётчику.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(2, 'average')">
          <h3 class="font-medium">8. Среднее — <code>average</code></h3>
          <p class="text-gray-700">
            Функция <code>average</code>. Список чисел <code>numbers</code>.
            Верни среднее: сумма всех чисел, делённая на то, сколько их.
            <code>[2, 4, 6]</code> → <code>4</code>. <code>[1, 2]</code> → <code>1.5</code>.
            Пустой список: делить не на что, верни <code>undefined</code>.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Если длина 0 — <code>undefined</code>. Иначе посчитай сумму циклом и верни <code>total / numbers.length</code>.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(2, 'indexOfNumber')">
          <h3 class="font-medium">9. На каком месте лежит число — <code>indexOfNumber</code></h3>
          <p class="text-gray-700">
            Функция <code>indexOfNumber</code>. Список <code>numbers</code> и число <code>target</code>, которое ищешь.
            Верни его место в списке, считая с нуля, а не само число.
            В <code>[10, 20, 30]</code> число 20 стоит на месте <code>1</code>: места идут 0, 1, 2.
            Если число встречается дважды, верни первое место: в <code>[5, 5]</code> пятёрка на месте <code>0</code>.
            Если числа нет или список пуст — верни <code>-1</code>. Минус один значит «не нашёл».
            Это не настоящее место: места начинаются с нуля.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <ol class="list-decimal list-inside mt-2 space-y-1">
              <li>Обычный <code>for</code> с <code>let i = 0</code>, пока <code>i &lt; numbers.length</code>.</li>
              <li>Если <code>numbers[i] === target</code>, сразу верни <code>i</code>.</li>
              <li>Цикл кончился, совпадения не было — верни <code>-1</code>.</li>
            </ol>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(2, 'sumEvenIndexes')">
          <h3 class="font-medium">10. Сумма на чётных номерах слотов — <code>sumEvenIndexes</code></h3>
          <p class="text-gray-700">
            Функция <code>sumEvenIndexes</code>. Список <code>numbers</code>.
            Сложи числа, которые стоят на чётных местах: место 0, место 2, место 4 и так далее.
            Важен номер места, не то, чётное ли само число.
            <code>[10, 20, 30, 40]</code> → <code>10 + 30 = 40</code>.
            Список из одного числа <code>[7]</code> → <code>7</code>: оно стоит на месте 0, а ноль чётный.
            Пустой список → <code>0</code>.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2"><code>let total = 0</code>. В цикле по <code>i</code>, если <code>i % 2 === 0</code>, прибавь <code>numbers[i]</code>.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(2, 'onlyEven')">
          <h3 class="font-medium">11. Собери новый список только из чётных — <code>onlyEven</code></h3>
          <p class="text-gray-700">
            Функция <code>onlyEven</code>. Список <code>numbers</code>.
            Верни новый список только из чётных чисел, в том же порядке.
            <code>[1, 2, 3, 4, 10]</code> → <code>[2, 4, 10]</code>. Это сам список, не количество.
            Если чётных нет или список пуст — верни <code>[]</code>. Список, который передали, не меняй.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Заведи пустой <code>[]</code>. В <code>for...of</code>, если число чётное, сделай <code>push</code>. Верни новый массив.</p>
          </details>
        </LearnTask>
      </section>

    </div>

    <!-- Урок 3 -->
    <div v-show="activeLessonId === 3" class="space-y-6">
      <section class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-2">Объекты: карточка с подписями</h2>
        <p class="text-gray-600">
          Массив — полка с номерами. Объект — анкета: у каждого значения есть имя поля.
          <code>user.city</code> читает поле, имя которого ты написал в коде: <code>city</code>.
          Если имя поля приходит в переменной, его пишут в квадратных скобках. Это задача 5.
        </p>
      </section>

      <section class="bg-white rounded-lg shadow-md p-6 space-y-6">
        <h2 class="text-2xl font-semibold">Теория</h2>
        <p class="text-gray-600">
          Массив отвечает на вопрос «что стоит на месте номер N». Объект отвечает на вопрос «что лежит в поле с таким именем».
          Почти все данные с сервера — это объект или массив объектов.
        </p>

        <div>
          <h3 class="text-lg font-medium mb-2">1. Карточка: имя поля и значение</h3>
          <p class="text-gray-700 mb-2">
            Объект записывают в фигурных скобках. Слева имя поля, справа значение. Пары разделяют запятой.
            Порядок полей для чтения по имени не важен: ты просишь <code>city</code>, а не «второй элемент».
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">const user = {
  name: 'Аня',
  city: 'Бишкек',
  age: 20,
}
user.city // 'Бишкек'
user.age // 20</pre>
          <p class="text-gray-700 mt-2">
            Имя поля без кавычек в такой записи — это строковый ключ <code>'city'</code>.
            Значение может быть любым типом из урока 1: число, строка, boolean, другой объект, массив.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">2. Точка — имя написано в коде</h3>
          <p class="text-gray-700 mb-2">
            <code>user.city</code> читает поле, чьё имя ты знаешь, когда пишешь файл.
            Точка ищет буквально поле <code>city</code>.
          </p>
          <p class="text-gray-700">
            Если поля нет, JS не падает. Результат чтения — <code>undefined</code>.
            Поэтому <code>getCity</code> может просто вернуть <code>profile.city</code>:
            город есть — вернётся строка, города нет — вернётся <code>undefined</code>.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">3. Квадратные скобки — имя лежит в переменной</h3>
          <p class="text-gray-700 mb-2">
            Точку нельзя собрать из переменной. <code>product.currency</code> всегда ищет поле с именем <code>currency</code>,
            даже если в переменной <code>currency</code> лежит строка <code>'USD'</code>.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">const product = {
  EUR: 10,
  USD: 12,
}
const currency = 'USD'

product.USD // 12 — имя написано в коде
product.currency // undefined — поля с именем currency нет
product[currency] // 12 — в скобках вычислилось 'USD', прочитали это поле
product['EUR'] // 10 — то же, что product.EUR</pre>
          <p class="text-gray-700 mt-2">
            Нет такого ключа — снова <code>undefined</code>. Для цены в неизвестной валюте это и есть ответ.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">4. Запись в поле и сравнение</h3>
          <p class="text-gray-700 mb-2">
            Чтение поле не создаёт. Запись создаёт или заменяет:
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">const user = { name: 'Аня' }
user.city = 'Бишкек'   // поля не было — появилось
user.name = 'Анна'     // поле было — значение заменилось</pre>
          <p class="text-gray-700 mt-2">
            Проверка галочки: <code>user.active === true</code>.
            Если поле <code>true</code>, результат <code>true</code>.
            Если поле <code>false</code> или его нет (<code>undefined === true</code>), результат <code>false</code>.
            Само поле <code>user.active</code> при отсутствии равно <code>undefined</code>, а задаче нужен boolean.
            Сравнение с <code>true</code> как раз превращает «нет поля» в честное <code>false</code>.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">5. Строка из нескольких полей</h3>
          <p class="text-gray-700">
            Поля — отдельные значения. Склеить их в одну строку можно плюсом или шаблоном из урока 1.
            <code>user.first + ' ' + user.last</code> для такого объекта даёт <code>Аня Ким</code>:
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto mt-2">{
  first: 'Аня',
  last: 'Ким',
}</pre>
          <p class="text-gray-700 mt-2">
            Пробел — это тоже строка <code>' '</code>, его нужно вставить самому: язык между полями ничего не дописывает.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">6. Список имён, значений и пар</h3>
          <p class="text-gray-700 mb-2">
            Объект сам по себе не имеет <code>.length</code>. Количество полей узнают через массив имён.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">const card = {
  a: 1,
  b: 2,
}

Object.keys(card) // ['a', 'b']
Object.values(card) // [1, 2]
Object.entries(card) // [['a', 1], ['b', 2]]

Object.keys(card).length // 2
Object.keys({}).length // 0</pre>
          <p class="text-gray-700 mt-2">
            <code>Object.keys</code> возвращает обычный массив строк. Дальше работает всё из урока 2:
            <code>.length</code>, <code>for...of</code>. Пустая карточка <code>{}</code> даёт пустой массив имён, длина <code>0</code>.
            Значения полей при подсчёте не читаются: считаются только имена.
          </p>
          <p class="text-gray-700 mt-2">
            <code>'a' in obj</code> спрашивает, есть ли поле с таким именем. Это не чтение значения.
            У <code>{ a: 0 }</code> поле <code>a</code> есть, хотя значение — ноль.
            <code>'a' in obj</code> даёт <code>true</code>. Проверка <code>obj.a === true</code> даёт <code>false</code>, потому что ноль не равен <code>true</code>.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">7. for...in здесь как раз про имена</h3>
          <p class="text-gray-700 mb-2">
            На объекте <code>for...in</code> отдаёт ключи. Значение достают скобками, потому что имя пришло в переменную.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">const user = {
  name: 'Аня',
  city: 'Бишкек',
}

for (const key in user) {
  const value = user[key]
  // круг 1: key === 'name', value === 'Аня'
  // круг 2: key === 'city', value === 'Бишкек'
}</pre>
          <p class="text-gray-700 mt-2">
            На массиве тот же цикл отдавал <code>"0"</code>, <code>"1"</code>, потому что индексы — это тоже имена полей.
            У обычной карточки имена осмысленные: <code>name</code>, <code>city</code>. Здесь <code>for...in</code> уместен.
            По значениям массива по-прежнему ходи через <code>for...of</code>.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">8. Две переменные могут смотреть на одну карточку</h3>
          <p class="text-gray-700 mb-2">
            Число при присваивании копируется: поменял новую переменную — старая осталась.
            Объект при присваивании не копируется. В переменной лежит ссылка на одну и ту же карточку в памяти.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">let a = 1
let b = a
b = 2
// a всё ещё 1

const card = { n: 1 }
const same = card
same.n = 2
// card.n тоже 2: same и card — одна карточка

const copy = { ...card }
copy.n = 9
// card.n остаётся 2: ... собрал новую карточку и скопировал поля верхнего уровня</pre>
          <p class="text-gray-700 mt-2">
            Это всплывает во Vue постоянно: изменил поле объекта в массиве — изменилась та же карточка, которую рисует страница.
            <code>{ ...card }</code> копирует только верхний слой. Если внутри поля лежит ещё один объект, внутренний остаётся общим.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">9. Когда массив, когда объект</h3>
          <ul class="list-disc list-inside text-gray-700 space-y-1">
            <li>Список однотипных вещей, важен порядок — массив: <code>[10, 20, 30]</code>.</li>
            <li>
              Одна сущность с разными полями — объект:
              <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto mt-2">{
  first: 'Аня',
  last: 'Ким',
}</pre>
            </li>
            <li>
              Список таких сущностей — массив объектов. Так устроены почти все таблицы и карточки на фронте:
              <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto mt-2">[
  {
    id: 1,
    name: 'Аня',
  },
  {
    id: 2,
    name: 'Ким',
  },
]</pre>
            </li>
          </ul>
        </div>
      </section>

      <section class="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 class="text-2xl font-semibold">Задачи</h2>
        <p class="text-gray-600">
          В заголовке — имя функции внизу файла, в блоке урока 3. Слова в скобках функции — аргументы, это имена в коде.
          Если справа всё зелёное, функцию не переписывай. Разбор под «Как это написать» открывай, только если застрял.
        </p>

        <LearnTask :checks="checksFor(3, 'getCity')">
          <h3 class="font-medium">1. Достань город из анкеты</h3>
          <div class="text-gray-700 space-y-2">
            <p>
              Функция <code>getCity</code>. Ей дают объект человека, в коде он называется <code>profile</code>.
              Пример:
            </p>
            <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">{
  name: 'Аня',
  city: 'Бишкек',
}</pre>
            <p>
              Поле <code>name</code> — имя, поле <code>city</code> — город.
              Верни город, строку <code>Бишкек</code>. Если поля <code>city</code> нет, верни <code>undefined</code>.
            </p>
          </div>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Прочитай поле через точку: <code>profile.city</code>. Отдельная проверка не нужна: нет поля — JS сам даст <code>undefined</code>.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(3, 'isActive')">
          <h3 class="font-medium">2. Аккаунт включён?</h3>
          <p class="text-gray-700">
            Функция <code>isActive</code>. Объект человека называется <code>user</code>.
            В нём может быть поле <code>active</code>: <code>true</code>, если аккаунт включён, <code>false</code>, если выключен.
            Верни <code>true</code> только когда это поле равно <code>true</code>.
            Если поле <code>false</code> или его вообще нет — верни <code>false</code>. Нужен ответ да/нет, не строка.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2"><code>user.active === true</code> само даёт boolean. Если поля нет, сравнение с <code>true</code> будет <code>false</code>.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(3, 'formatFullName')">
          <h3 class="font-medium">3. Склей имя и фамилию</h3>
          <div class="text-gray-700 space-y-2">
            <p>
              Функция <code>formatFullName</code>. Объект <code>user</code> с двумя полями:
              <code>first</code> — имя, <code>last</code> — фамилия. Пример:
            </p>
            <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">{
  first: 'Аня',
  last: 'Ким',
}</pre>
            <p>Верни одну строку <code>Аня Ким</code>: имя, один пробел, фамилия. Без запятой.</p>
          </div>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2"><code>user.first + ' ' + user.last</code> или шаблонная строка, как в приветствии из урока 1.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(3, 'countFields')">
          <h3 class="font-medium">4. Сколько полей в карточке</h3>
          <div class="text-gray-700 space-y-2">
            <p>
              Функция <code>countFields</code>. Ей дают любой объект, в коде он называется <code>obj</code>.
              Поле — это пара «имя: значение». Например:
            </p>
            <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">{
  a: 1,
  b: 2,
}</pre>
            <p>
              Здесь два поля: имена <code>a</code> и <code>b</code>, значения 1 и 2.
              Буквы <code>a</code> и <code>b</code> ничем не особенные, это просто имена. Верни, сколько полей: <code>2</code>.
              У пустого объекта <code>{}</code> полей нет, верни <code>0</code>. Значения не читай, считай только имена.
            </p>
          </div>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2"><code>Object.keys(obj)</code> — массив имён. Верни его <code>length</code>.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(3, 'readPrice')">
          <h3 class="font-medium">5. Цена в нужной валюте</h3>
          <div class="text-gray-700 space-y-2">
            <p>
              Функция <code>readPrice</code> в блоке урока 3. У неё два аргумента, их имена уже написаны в скобках функции.
              <code>product</code> — объект с ценами. Это не команда и не умножение из урока 1.
              <code>EUR</code> и <code>USD</code> — имена полей, 10 и 12 — цены:
            </p>
            <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">{
  EUR: 10,
  USD: 12,
}</pre>
            <p>
              <code>currency</code> — строка, какую цену достать, например <code>'USD'</code>.
              Такой вызов должен вернуть число <code>12</code>:
            </p>
            <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">readPrice(
  {
    EUR: 10,
    USD: 12,
  },
  'USD',
)</pre>
            <p>
              Если такой валюты нет, например спросили <code>'GBP'</code>, верни <code>undefined</code>.
              Заранее написать <code>product.USD</code> нельзя: валюта каждый раз другая и приходит вторым аргументом.
            </p>
          </div>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Аргументы функции уже названы <code>product</code> и <code>currency</code>. Верни <code>product[currency]</code>: в скобках строка с именем поля, которая пришла вторым аргументом. Это цена либо <code>undefined</code>.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(3, 'livesIn')">
          <h3 class="font-medium">6. Живёт ли человек в этом городе — <code>livesIn</code></h3>
          <p class="text-gray-700">
            Функция <code>livesIn</code>. Два аргумента.
            Первый — объект человека <code>user</code>, у него может быть поле <code>city</code>.
            Второй — строка <code>city</code>, город, с которым сравниваешь.
            Верни <code>true</code>, если город в объекте совпал с этой строкой, иначе <code>false</code>.
            <code>livesIn({ city: 'Бишкек' }, 'Бишкек')</code> → <code>true</code>.
            <code>livesIn({ city: 'Ош' }, 'Бишкек')</code> → <code>false</code>.
            Если поля <code>city</code> нет — тоже <code>false</code>. Верни да/нет, не сам город.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2"><code>user.city === city</code>. Нет поля — слева <code>undefined</code>, сравнение даёт <code>false</code>.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(3, 'formatCard')">
          <h3 class="font-medium">7. Одна строка из трёх полей — <code>formatCard</code></h3>
          <div class="text-gray-700 space-y-2">
            <p>
              Функция <code>formatCard</code>. Объект <code>user</code> с тремя полями:
              <code>name</code> — имя, <code>city</code> — город, <code>age</code> — возраст числом.
            </p>
            <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">{
  name: 'Аня',
  city: 'Бишкек',
  age: 20,
}</pre>
            <p>
              Из этого объекта собери ровно строку <code>Аня, Бишкек, 20 лет</code>.
              Между частями запятая и пробел, в конце слово «лет».
            </p>
          </div>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Шаблон: <code>`${user.name}, ${user.city}, ${user.age} лет`</code>.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(3, 'sumValues')">
          <h3 class="font-medium">8. Сложи все числа в карточке — <code>sumValues</code></h3>
          <div class="text-gray-700 space-y-2">
            <p>
              Функция <code>sumValues</code>. Объект называется <code>bag</code>, внутри несколько чисел.
              Имена полей заранее неизвестны. Сложи 1 и 2, верни <code>3</code>:
            </p>
            <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">{
  a: 1,
  b: 2,
}</pre>
            <p>А этот объект даёт <code>22</code>:</p>
            <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">{
  EUR: 10,
  USD: 12,
}</pre>
            <p>
              Пустой объект → <code>0</code>.
              Точка здесь не подходит: чтобы написать <code>bag.EUR</code>, имя <code>EUR</code> нужно знать, когда пишешь файл.
              В этой задаче имена каждый раз другие.
            </p>
          </div>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <ol class="list-decimal list-inside mt-2 space-y-1">
              <li><code>let total = 0</code> до цикла.</li>
              <li><code>for (const key in bag)</code>.</li>
              <li>Прибавляй <code>bag[key]</code>, не сам <code>key</code>. Ключ — это имя, строка.</li>
              <li>Верни <code>total</code>.</li>
            </ol>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(3, 'hasKey')">
          <h3 class="font-medium">9. Есть ли поле с таким именем — <code>hasKey</code></h3>
          <p class="text-gray-700">
            Функция <code>hasKey</code>. Объект <code>obj</code> и строка <code>key</code> — имя поля, которое ищешь.
            Верни <code>true</code>, если поле с таким именем есть, даже когда в нём <code>0</code> или <code>false</code>.
            <code>hasKey({ a: 1 }, 'a')</code> → <code>true</code>.
            <code>hasKey({ a: 1 }, 'b')</code> → <code>false</code>: поля <code>b</code> нет.
            <code>hasKey({ a: 0 }, 'a')</code> → <code>true</code>: ноль — это значение, а поле при этом есть.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Верни <code>key in obj</code>.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(3, 'withRenamed')">
          <h3 class="font-medium">10. Новая карточка с другим именем — <code>withRenamed</code></h3>
          <div class="text-gray-700 space-y-2">
            <p>
              Функция <code>withRenamed</code>. Объект <code>user</code> и строка <code>name</code> — новое имя.
              Верни новый объект: поле <code>name</code> заменено, остальные поля скопированы.
              Такой вызов даёт объект, где имя <code>Анна</code>, а город по-прежнему <code>Бишкек</code>:
            </p>
            <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">withRenamed(
  {
    name: 'Аня',
    city: 'Бишкек',
  },
  'Анна',
)</pre>
            <p>
              Объект, который передали, не меняй: у него имя остаётся <code>Аня</code>.
              Если изменить его и вернуть тот же объект, проверка увидит, что старое имя тоже стало <code>Анна</code>.
            </p>
          </div>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Верни <code>{ ...user, name }</code>. Три точки копируют поля в новый объект, <code>name</code> после них перекрывает старое имя.</p>
          </details>
        </LearnTask>
      </section>

    </div>

    <!-- Урок 4 -->
    <div v-show="activeLessonId === 4" class="space-y-6">
      <section class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-2">Методы массива: цикл уже написан</h2>
        <p class="text-gray-600">
          В уроке 2 ты сам крутил <code>for</code> и руками складывал новый массив.
          У массива есть методы: функции, которые висят на нём через точку.
          Внутри метода цикл уже есть. Ты передаёшь свою функцию, метод вызывает её на каждом элементе.
          В <code>sumValues</code> урока 3 ты уже написал <code>reduce</code>. Этот урок разбирает, что при этом происходит.
        </p>
      </section>

      <section class="bg-white rounded-lg shadow-md p-6 space-y-6">
        <h2 class="text-2xl font-semibold">Теория</h2>
        <p class="text-gray-600">
          Метод — это функция, которая лежит на значении. <code>numbers.map</code> — сама функция.
          <code>numbers.map(...)</code> — её вызов. Скобки запускают. Без скобок функцию можно передать дальше, как обычное значение.
        </p>

        <div>
          <h3 class="text-lg font-medium mb-2">1. Функция — тоже значение</h3>
          <p class="text-gray-700 mb-2">
            Имя функции без скобок — это сама функция. Со скобками — результат её работы.
            Функцию можно положить в другую переменную. Обе переменные запускают один и тот же код.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">function double(n) {
  return n * 2
}

const same = double
same(3) // 6

double // это функция, её ещё не запускали
double(3) // 6, скобки запустили</pre>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">2. Колбэк: метод сам вызывает твою функцию</h3>
          <p class="text-gray-700 mb-2">
            Колбэк — функция, которую ты отдаёшь методу. Метод вызывает её сам.
            <code>map</code> берёт каждый элемент, передаёт его в твою функцию первым аргументом и собирает то, что функция вернула.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">function double(n) {
  return n * 2
}

const numbers = [1, 2, 3]
numbers.map(double)
// map вызвал double(1), потом double(2), потом double(3)
// собрал ответы в новый массив: [2, 4, 6]
// numbers остался [1, 2, 3]</pre>
          <p class="text-gray-700 mt-2">
            Имя аргумента в колбэке выбираешь ты. <code>n</code>, <code>item</code>, <code>age</code> — для метода это просто «первый аргумент, сюда кладу элемент».
            Второй аргумент, если он нужен, — индекс с нуля, как в уроке 2.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">3. Стрелка — короткая запись функции</h3>
          <p class="text-gray-700 mb-2">
            В <code>sumValues</code> у тебя уже стоит <code>(acc, curr) =&gt; acc + curr</code>.
            Это функция. <code>acc</code> — первый аргумент, <code>curr</code> — второй, справа от стрелки — то, что она возвращает.
            Фигурных скобок нет, поэтому <code>return</code> пишется сам.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">const double = (n) => n * 2

// тело длиннее одной формулы — скобки и явный return:
const doubleLong = (n) => {
  return n * 2
}</pre>
          <p class="text-gray-700 mt-2">
            Если в фигурных скобках забыть <code>return</code>, функция вернёт <code>undefined</code>.
            У <code>map</code> тогда в новом массиве на каждом месте будет <code>undefined</code>.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">4. map — новый массив той же длины</h3>
          <p class="text-gray-700 mb-2">
            <code>map</code> проходит все элементы. Длина нового массива равна длине старого.
            На место каждого элемента встаёт то, что вернул колбэк. Исходный массив остаётся как был.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">const numbers = [1, 2, 3]
const doubled = numbers.map((n) => n * 2)
// doubled: [2, 4, 6]
// numbers: [1, 2, 3]

const users = [
  {
    name: 'Аня',
    city: 'Бишкек',
  },
  {
    name: 'Ким',
    city: 'Ош',
  },
]
users.map((user) => user.name)
// ['Аня', 'Ким']</pre>
          <p class="text-gray-700 mt-2">
            Пустой массив даёт пустой массив: вызывать колбэк не на ком.
            Второй аргумент колбэка — индекс. <code>(n, index) =&gt; n + index</code> для <code>[10, 20, 30]</code> даёт <code>[10, 21, 32]</code>:
            10+0, 20+1, 30+2.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">5. filter — оставить только подходящие</h3>
          <p class="text-gray-700 mb-2">
            Колбэк <code>filter</code> возвращает boolean. <code>true</code> — элемент попадает в новый массив.
            <code>false</code> — элемент в новый массив не входит. Новый массив короче или той же длины.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">const ages = [17, 18, 20]
ages.filter((age) => age >= 18)
// [18, 20]

const empty = []
empty.filter((age) => age >= 18)
// []</pre>
          <p class="text-gray-700 mt-2">
            <code>age &gt;= 18</code> уже boolean, его и возвращает стрелка.
            Забытый <code>return</code> внутри фигурных скобок даёт <code>undefined</code>. Для <code>filter</code> это «не оставлять»: новый массив окажется пустым.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">6. find — первый подходящий элемент</h3>
          <p class="text-gray-700 mb-2">
            <code>find</code> тоже спрашивает колбэк «подходит?». Он останавливается на первом <code>true</code> и возвращает сам элемент: число или объект.
            Массив он не собирает. Если не подошёл никто, результат <code>undefined</code>.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">const products = [
  {
    name: 'чай',
    price: 10,
  },
  {
    name: 'кофе',
    price: 20,
  },
]
const found = products.find((item) => item.name === 'кофе')
// found — объект кофе, у него price 20
found?.price // 20

products.find((item) => item.name === 'сок')
// undefined, такого товара нет</pre>
          <p class="text-gray-700 mt-2">
            <code>?.</code> читает <code>price</code> только когда объект найден. На <code>undefined</code> точка без вопроса упала бы: у пустоты нет поля <code>price</code>.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">7. some и every — один ответ на весь список</h3>
          <p class="text-gray-700 mb-2">
            Оба возвращают boolean, новый массив не строят.
            <code>some</code> — «есть ли хотя бы один подходящий?».
            <code>every</code> — «подходят ли все?».
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">const ages = [17, 20]
ages.some((age) => age >= 18) // true, 20 подошёл
ages.every((age) => age >= 18) // false, 17 не подошёл

const empty = []
empty.some((age) => age >= 18) // false
empty.every((age) => age >= 18) // true</pre>
          <p class="text-gray-700 mt-2">
            Пустой <code>every</code> даёт <code>true</code>. Вопрос звучит так: «есть ли в списке хоть один, кто правило нарушил?».
            В пустом списке нарушителя нет, поэтому правило выполняется для всех, кто в списке есть.
            Пустой <code>some</code> даёт <code>false</code>: подходящего тоже нет, подтвердить «хотя бы один» нечем.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">8. reduce — чемодан по всему списку</h3>
          <p class="text-gray-700 mb-2">
            <code>reduce</code> несёт по массиву одно значение. Его называют аккумулятором: чемодан.
            Колбэк получает чемодан и текущий элемент, возвращает следующий чемодан.
            Второй аргумент <code>reduce</code> — чемодан до первого элемента.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">const numbers = [1, 2, 3]
numbers.reduce((total, n) => total + n, 0)
// старт: total = 0
// шаг: total 0 и n 1, вернули 1
// шаг: total 1 и n 2, вернули 3
// шаг: total 3 и n 3, вернули 6

const empty = []
empty.reduce((total, n) => total + n, 0)
// 0, шагов нет, остался стартовый чемодан</pre>
          <p class="text-gray-700 mt-2">
            В твоём <code>sumValues</code> роль <code>total</code> называется <code>acc</code>, роль <code>n</code> — <code>curr</code>.
            Ноль в конце — стартовый чемодан. Для суммы пустого списка это честный 0.
            Без второго аргумента <code>reduce</code> берёт чемодан из первого элемента. У пустого массива первого элемента нет, и вызов падает.
            <code>reduce</code> есть у массива. Объект ты сначала превратил в массив через <code>Object.values</code>, потом уже сложил.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">9. Цепочка: ответ метода снова массив</h3>
          <p class="text-gray-700 mb-2">
            <code>filter</code> и <code>map</code> возвращают массив. На этом массиве можно сразу вызвать следующий метод.
            Каждое звено строит свой новый массив. Исходный список остаётся.
          </p>
          <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">const users = [
  {
    name: 'Аня',
    age: 20,
  },
  {
    name: 'Макс',
    age: 7,
  },
]
users
  .filter((user) => user.age >= 18)
  .map((user) => user.name)
// ['Аня']</pre>
          <p class="text-gray-700 mt-2">
            Сначала остались только взрослые, потом из них достали имена.
            Порядок звеньев меняет работу: <code>map</code> до <code>filter</code> уже выкинул возраст, и фильтровать по возрасту будет нечего.
          </p>
        </div>
      </section>

      <section class="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 class="text-2xl font-semibold">Задачи</h2>
        <p class="text-gray-600">
          В заголовке — имя функции внизу файла, в блоке урока 4. Слова в скобках функции — аргументы, это имена в коде.
          Если справа всё зелёное, функцию не переписывай. Разбор под «Как это написать» открывай, только если застрял.
          Массив, который пришёл аргументом, оставляй как был: метод сам собирает новый.
        </p>

        <LearnTask :checks="checksFor(4, 'doubleAll')">
          <h3 class="font-medium">1. Удвой каждое число — <code>doubleAll</code></h3>
          <p class="text-gray-700">
            Функция <code>doubleAll</code>. Аргумент <code>numbers</code> — массив чисел.
            Верни новый массив, где каждое число умножено на 2.
            <code>doubleAll([1, 2, 3])</code> → <code>[2, 4, 6]</code>.
            <code>doubleAll([-1, 4])</code> → <code>[-2, 8]</code>.
            Пустой список → пустой массив.
            Список, который передали, остаётся <code>[1, 2, 3]</code>, даже после вызова.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Верни <code>numbers.map((n) =&gt; n * 2)</code>.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(4, 'namesOf')">
          <h3 class="font-medium">2. Достань имена — <code>namesOf</code></h3>
          <div class="text-gray-700 space-y-2">
            <p>
              Функция <code>namesOf</code>. Аргумент <code>users</code> — массив людей.
              У каждого человека есть поле <code>name</code>, это строка. Верни массив этих строк.
            </p>
            <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">[
  {
    name: 'Аня',
  },
  {
    name: 'Ким',
  },
]</pre>
            <p>
              Из этого списка верни <code>['Аня', 'Ким']</code>.
              Пустой список людей → пустой массив.
            </p>
          </div>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Верни <code>users.map((user) =&gt; user.name)</code>.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(4, 'addIndex')">
          <h3 class="font-medium">3. Прибавь индекс — <code>addIndex</code></h3>
          <p class="text-gray-700">
            Функция <code>addIndex</code>. Аргумент <code>numbers</code> — массив чисел.
            Индекс — номер места, с нуля, как в уроке 2.
            Верни новый массив: к каждому числу прибавлен его индекс.
            <code>addIndex([10, 20, 30])</code> → <code>[10, 21, 32]</code>, потому что 10+0, 20+1, 30+2.
            <code>addIndex([7])</code> → <code>[7]</code>: единственный элемент стоит на месте 0.
            Пустой список → пустой массив.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Второй аргумент колбэка — индекс. Верни <code>numbers.map((n, index) =&gt; n + index)</code>.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(4, 'keepAdults')">
          <h3 class="font-medium">4. Оставь взрослые возраста — <code>keepAdults</code></h3>
          <p class="text-gray-700">
            Функция <code>keepAdults</code>. Аргумент <code>ages</code> — массив возрастов, числа.
            Взрослый — возраст 18 и старше, та же граница, что в <code>isAdult</code>.
            Верни новый массив только из таких чисел, порядок как в исходном списке.
            <code>keepAdults([17, 18, 20])</code> → <code>[18, 20]</code>.
            <code>keepAdults([17, 10])</code> → пустой массив.
            Пустой список → пустой массив.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Верни <code>ages.filter((age) =&gt; age &gt;= 18)</code>.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(4, 'findPrice')">
          <h3 class="font-medium">5. Цена товара по названию — <code>findPrice</code></h3>
          <div class="text-gray-700 space-y-2">
            <p>
              Функция <code>findPrice</code>. Первый аргумент <code>products</code> — массив товаров.
              Слово уже встречалось: в уроке 1 <code>product</code> — умножение, в уроке 3 — объект с валютами.
              Здесь это список. У товара два поля: <code>name</code> — название, строка, <code>price</code> — цена, число.
              Второй аргумент <code>name</code> — какое название искать.
            </p>
            <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">[
  {
    name: 'чай',
    price: 10,
  },
  {
    name: 'кофе',
    price: 20,
  },
]</pre>
            <p>
              <code>findPrice</code> с этим списком и строкой <code>'кофе'</code> верни число <code>20</code>.
              Если таких названий несколько, верни цену первого.
              Если названия нет, верни <code>undefined</code>.
              Пока функция пустая, проверка «сока нет» зелёная: пустой <code>return</code> и отсутствие товара оба дают <code>undefined</code>.
              Честной она станет вместе с ценой кофе.
            </p>
          </div>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">
              <code>find</code> возвращает товар или <code>undefined</code>.
              Верни <code>products.find((item) =&gt; item.name === name)?.price</code>.
            </p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(4, 'hasExpensive')">
          <h3 class="font-medium">6. Есть ли цена строго дороже порога — <code>hasExpensive</code></h3>
          <p class="text-gray-700">
            Функция <code>hasExpensive</code>. <code>prices</code> — массив цен, числа.
            <code>limit</code> — порог, тоже число. Верни <code>true</code>, если хотя бы одна цена строго больше порога.
            Равенство порогу — ещё не «дороже».
            <code>hasExpensive([10, 30], 20)</code> → <code>true</code>.
            <code>hasExpensive([10, 20], 20)</code> → <code>false</code>.
            Пустой список → <code>false</code>: дорогой цены в нём нет.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Верни <code>prices.some((price) =&gt; price &gt; limit)</code>.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(4, 'allAdults')">
          <h3 class="font-medium">7. Все ли возрасты взрослые — <code>allAdults</code></h3>
          <p class="text-gray-700">
            Функция <code>allAdults</code>. Аргумент <code>ages</code> — массив возрастов.
            Верни <code>true</code>, если каждое число 18 или больше.
            <code>allAdults([18, 20])</code> → <code>true</code>.
            <code>allAdults([17, 20])</code> → <code>false</code>.
            Пустой список → <code>true</code>. Нарушителя границы в нём нет, это разобрано в теории про <code>every</code>.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Верни <code>ages.every((age) =&gt; age &gt;= 18)</code>.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(4, 'sumWithReduce')">
          <h3 class="font-medium">8. Сумма через reduce — <code>sumWithReduce</code></h3>
          <p class="text-gray-700">
            Функция <code>sumWithReduce</code>. Аргумент <code>numbers</code> — массив чисел.
            Сложи их одним <code>reduce</code>. Стартовый чемодан — <code>0</code>.
            <code>sumWithReduce([1, 2, 3])</code> → <code>6</code>.
            <code>sumWithReduce([-2, 5])</code> → <code>3</code>.
            Пустой список → <code>0</code>.
          </p>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Верни <code>numbers.reduce((total, n) =&gt; total + n, 0)</code>.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(4, 'totalPrice')">
          <h3 class="font-medium">9. Сумма чека — <code>totalPrice</code></h3>
          <div class="text-gray-700 space-y-2">
            <p>
              Функция <code>totalPrice</code>. Аргумент <code>items</code> — массив строк чека.
              У строки два поля: <code>price</code> — цена одной штуки, <code>count</code> — сколько штук.
              Стоимость строки — цена умножить на количество. Верни сумму стоимостей всех строк.
            </p>
            <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">[
  {
    price: 10,
    count: 2,
  },
  {
    price: 3,
    count: 1,
  },
]</pre>
            <p>
              10×2 и 3×1 дают <code>23</code>. Пустой чек → <code>0</code>.
            </p>
          </div>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Верни <code>items.reduce((total, item) =&gt; total + item.price * item.count, 0)</code>.</p>
          </details>
        </LearnTask>

        <LearnTask :checks="checksFor(4, 'adultNames')">
          <h3 class="font-medium">10. Имена взрослых — <code>adultNames</code></h3>
          <div class="text-gray-700 space-y-2">
            <p>
              Функция <code>adultNames</code>. Аргумент <code>users</code> — массив людей.
              У человека два поля: <code>name</code> — строка, <code>age</code> — число.
              Верни массив имён тех, кому 18 и больше. Сначала отбор, потом имена.
            </p>
            <pre class="bg-gray-50 border rounded-md p-3 text-sm overflow-x-auto">[
  {
    name: 'Аня',
    age: 20,
  },
  {
    name: 'Макс',
    age: 7,
  },
  {
    name: 'Ким',
    age: 18,
  },
]</pre>
            <p>
              Из этого списка верни <code>['Аня', 'Ким']</code>.
              Если взрослых нет — пустой массив. Пустой список → пустой массив.
              Исходный массив людей остаётся с теми же возрастами: метод строит новые массивы, поля старых объектов не стирай.
            </p>
          </div>
          <details class="text-sm text-gray-700">
            <summary class="cursor-pointer text-amber-800">Как это написать</summary>
            <p class="mt-2">Верни <code>users.filter((user) =&gt; user.age &gt;= 18).map((user) =&gt; user.name)</code>.</p>
          </details>
        </LearnTask>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const { setPageSeo } = useSeo()
setPageSeo('Учим JS | MyApp', 'Уроки JavaScript с нуля')

// id урока. Один тип на вкладки, проверки и счётчик: забыл четвёрку в одном месте — TypeScript подсветит.
type LessonId = 1 | 2 | 3 | 4

const lessons = [
  { id: 1, title: 'Значения и функции' },
  { id: 2, title: 'Массивы и циклы' },
  { id: 3, title: 'Объекты' },
  { id: 4, title: 'Методы массива' },
] as const

const activeLessonId = ref<LessonId>(4)

// =============================================================================
// === УРОК 1 — ТВОИ РЕШЕНИЯ ===================================================
// =============================================================================

function sum(a: number, b: number): number | undefined {
  return a + b
}

function isAdult(age: number): boolean | undefined {
  return age >= 18
}

function formatGreeting(name: string): string | undefined {
  return `Привет, ${name}!`
}

function product(a: number, b: number): number | undefined {
  return a * b
}

function subtract(a: number, b: number): number | undefined {
  return a - b
}

function remainder(a: number, b: number): number | undefined {
  return a % b
}

function isSame(a: unknown, b: unknown): boolean | undefined {
  return a === b
}

function joinWithSpace(left: string, right: string): string | undefined {
  return `${left} ${right}`
}

function describeHeat(temp: number): string | undefined {
  if (temp >= 30) {
    return 'жарко';
  }
  
  if (temp >= 20) {
    return 'тепло';
  }
  
  return 'прохладно';
}

function larger(a: number, b: number): number | undefined {
  return a > b ? a : b
}

function divideSafe(a: number, b: number): number | undefined {
  return b == 0 ? undefined : a / b
}

// =============================================================================
// === УРОК 2 — ТВОИ РЕШЕНИЯ ===================================================
// =============================================================================

function getFirst(items: number[]): number | undefined {
  return items.length === 0 ? undefined : items[0]
}

function sumList(numbers: number[]): number | undefined {
  let total = 0
  for (const n of numbers) {
    total = total + n
  }
  return total
}

function countEven(numbers: number[]): number | undefined {
  let count = 0
  for (const n of numbers) {
    if (n % 2 === 0) {
      count = count + 1
    }
  }
  return count
}

function getLast(items: number[]): number | undefined {
  return items[items.length - 1]
}

function maxOf(numbers: number[]): number | undefined {
  if (numbers.length === 0) return undefined
  let biggest = numbers[0]

  for (const n in numbers) {
    if (numbers[n] > biggest) {
      biggest = numbers[n]
    }

  }
  return biggest
}

function minOf(numbers: number[]): number | undefined {
  if (numbers.length === 0) return undefined
  let biggest = numbers[0]

  for (const n in numbers) {
    if (numbers[n] < biggest) {
      biggest = numbers[n]
    }

  }
  return biggest
}

function countGreater(numbers: number[], limit: number): number | undefined {
  let count = 0
  for (const n of numbers) {
    if (n > limit) {
      count = count + 1
    }
  }
  return count

}

function average(numbers: number[]): number | undefined {
  if (numbers.length === 0) return undefined
  let count = numbers.length
  let summ = 0

  for (const n of numbers) {
    summ = summ + n
  }

  return summ / count
}

function indexOfNumber(numbers: number[], target: number): number | undefined {
  let result = 0
  if (numbers.length === 0) return -1

  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === target) {
      return i
    }

    else if (numbers[i] !== target) {
      result = -1
    }
  }
  return result
}

function sumEvenIndexes(numbers: number[]): number | undefined {
  let result = 0
  if (numbers.length === 0) return 0

  for (let i = 0; i < numbers.length; i++) {
    if (i % 2 === 0) {
      result = result + numbers[i]
    }
  }
  return result
}

function onlyEven(numbers: number[]): number[] | undefined {
  if (numbers.length === 0) return []
  let result = []
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] % 2 === 0) {
      result.push(numbers[i])
    }
  }
  return result
}

// =============================================================================
// === УРОК 3 — ТВОИ РЕШЕНИЯ ===================================================
// =============================================================================

function getCity(profile: { city?: string }): string | undefined {
  return profile?.city
}

function isActive(user: { active?: boolean }): boolean | undefined {
  return user?.active ? true : false //!!user?.active
}

function formatFullName(user: { first: string, last: string }): string | undefined {
  return `${user.first} ${user.last}`
}

function countFields(obj: Record<string, unknown>): number | undefined {
  return Object.keys(obj).length
}

function readPrice(product: Record<string, number>, currency: string): number | undefined {
  return product[currency]
}

// Новые функции урока 3. Пустые тела: сравнение полей, for...in, оператор in, копия объекта.
function livesIn(user: { city?: string }, city: string): boolean | undefined {
  return user.city === city
}

function formatCard(user: { name: string, city: string, age: number }): string | undefined {
  return `${user.name}, ${user.city}, ${user.age} лет`
}

function sumValues(bag: Record<string, number>): number | undefined {
  return Object.values(bag).reduce((acc, curr) => acc + curr, 0)
}

function hasKey(obj: Record<string, unknown>, key: string): boolean | undefined {
  return key in obj
}

function withRenamed(
  user: { name?: string, city?: string },
  name: string,
): { name?: string, city?: string } | undefined {
  return { ...user, name }
}

// =============================================================================
// === УРОК 4 — ТВОИ РЕШЕНИЯ ===================================================
// =============================================================================

// Пустые тела. Метод массива сам обходит список и собирает ответ из того, что вернёт колбэк.
function doubleAll(numbers: number[]): number[] | undefined {
  return undefined
}

function namesOf(users: { name: string }[]): string[] | undefined {
  return undefined
}

function addIndex(numbers: number[]): number[] | undefined {
  return undefined
}

function keepAdults(ages: number[]): number[] | undefined {
  return undefined
}

function findPrice(
  products: { name: string, price: number }[],
  name: string,
): number | undefined {
  return undefined
}

function hasExpensive(prices: number[], limit: number): boolean | undefined {
  return undefined
}

function allAdults(ages: number[]): boolean | undefined {
  return undefined
}

function sumWithReduce(numbers: number[]): number | undefined {
  return undefined
}

function totalPrice(items: { price: number, count: number }[]): number | undefined {
  return undefined
}

function adultNames(users: { name: string, age: number }[]): string[] | undefined {
  return undefined
}

// =============================================================================
// === ПРОВЕРКА ================================================================
// =============================================================================

type Check = {
  // Имя задачи. Карточка LearnTask показывает только проверки с тем же task.
  task: string
  id: string
  title: string
  expected: unknown
  actual: unknown
  ok: boolean
}

const runCheck = (task: string, id: string, title: string, expected: unknown, fn: () => unknown): Check => {
  let actual: unknown
  try {
    actual = fn()
  } catch (error) {
    actual = error instanceof Error ? error.message : 'ошибка'
  }

  return {
    task,
    id,
    title,
    expected,
    actual,
    ok: Object.is(actual, expected),
  }
}

const checksByLesson = computed<Record<LessonId, Check[]>>(() => ({
  1: [
    runCheck('sum', 'sum-1', 'sum(2, 3) === 5', 5, () => sum(2, 3)),
    runCheck('sum', 'sum-2', 'sum(10, -4) === 6', 6, () => sum(10, -4)),
    runCheck('isAdult', 'adult-1', 'isAdult(18) === true', true, () => isAdult(18)),
    runCheck('isAdult', 'adult-2', 'isAdult(17) === false', false, () => isAdult(17)),
    runCheck('formatGreeting', 'greet-1', 'formatGreeting("Аня")', 'Привет, Аня!', () => formatGreeting('Аня')),
    runCheck('formatGreeting', 'greet-2', 'formatGreeting("Макс")', 'Привет, Макс!', () => formatGreeting('Макс')),
    runCheck('product', 'product-1', 'product(2, 3) === 6', 6, () => product(2, 3)),
    runCheck('product', 'product-2', 'product(10, -1) === -10', -10, () => product(10, -1)),
    runCheck('subtract', 'sub-1', 'subtract(10, 4) === 6', 6, () => subtract(10, 4)),
    runCheck('subtract', 'sub-2', 'subtract(3, 10) === -7', -7, () => subtract(3, 10)),
    runCheck('remainder', 'rem-1', 'remainder(7, 2) === 1', 1, () => remainder(7, 2)),
    runCheck('remainder', 'rem-2', 'remainder(8, 2) === 0', 0, () => remainder(8, 2)),
    runCheck('isSame', 'same-1', 'isSame(18, 18) === true', true, () => isSame(18, 18)),
    runCheck('isSame', 'same-2', 'isSame(18, "18") === false', false, () => isSame(18, '18')),
    runCheck('isSame', 'same-3', 'isSame("Аня", "Аня") === true', true, () => isSame('Аня', 'Аня')),
    runCheck('joinWithSpace', 'join-1', 'joinWithSpace Аня Ким', 'Аня Ким', () => joinWithSpace('Аня', 'Ким')),
    runCheck('joinWithSpace', 'join-2', 'joinWithSpace Макс Ли', 'Макс Ли', () => joinWithSpace('Макс', 'Ли')),
    runCheck('describeHeat', 'heat-1', 'describeHeat(35) жарко', 'жарко', () => describeHeat(35)),
    runCheck('describeHeat', 'heat-2', 'describeHeat(30) жарко', 'жарко', () => describeHeat(30)),
    runCheck('describeHeat', 'heat-3', 'describeHeat(20) тепло', 'тепло', () => describeHeat(20)),
    runCheck('describeHeat', 'heat-4', 'describeHeat(19) прохладно', 'прохладно', () => describeHeat(19)),
    runCheck('larger', 'larger-1', 'larger(3, 9) === 9', 9, () => larger(3, 9)),
    runCheck('larger', 'larger-2', 'larger(-1, -5) === -1', -1, () => larger(-1, -5)),
    runCheck('larger', 'larger-3', 'larger(4, 4) === 4', 4, () => larger(4, 4)),
    runCheck('divideSafe', 'div-1', 'divideSafe(10, 2) === 5', 5, () => divideSafe(10, 2)),
    runCheck('divideSafe', 'div-2', 'divideSafe(7, 2) === 3.5', 3.5, () => divideSafe(7, 2)),
    runCheck('divideSafe', 'div-3', 'divideSafe(10, 0) === undefined', undefined, () => divideSafe(10, 0)),
  ],
  2: [
    runCheck('getFirst', 'first-1', 'getFirst([10, 20, 30]) === 10', 10, () => getFirst([10, 20, 30])),
    runCheck('getFirst', 'first-2', 'getFirst([]) === undefined', undefined, () => getFirst([])),
    runCheck('sumList', 'sum-list-1', 'sumList([1, 2, 3]) === 6', 6, () => sumList([1, 2, 3])),
    runCheck('sumList', 'sum-list-2', 'sumList([]) === 0', 0, () => sumList([])),
    runCheck('countEven', 'even-1', 'countEven([1, 2, 3, 4, 10]) === 3', 3, () => countEven([1, 2, 3, 4, 10])),
    runCheck('countEven', 'even-2', 'countEven([1, 3, 5]) === 0', 0, () => countEven([1, 3, 5])),
    runCheck('getLast', 'last-1', 'getLast([10, 20, 30]) === 30', 30, () => getLast([10, 20, 30])),
    runCheck('getLast', 'last-2', 'getLast([]) === undefined', undefined, () => getLast([])),
    runCheck('maxOf', 'max-1', 'maxOf([3, 9, 1]) === 9', 9, () => maxOf([3, 9, 1])),
    runCheck('maxOf', 'max-2', 'maxOf([-5, -1, -8]) === -1', -1, () => maxOf([-5, -1, -8])),
    runCheck('maxOf', 'max-3', 'maxOf([]) === undefined', undefined, () => maxOf([])),
    runCheck('minOf', 'min-1', 'minOf([3, 9, 1]) === 1', 1, () => minOf([3, 9, 1])),
    runCheck('minOf', 'min-2', 'minOf([-5, -1, -8]) === -8', -8, () => minOf([-5, -1, -8])),
    runCheck('minOf', 'min-3', 'minOf([]) === undefined', undefined, () => minOf([])),
    runCheck('countGreater', 'greater-1', 'countGreater([1, 5, 8, 3], 4) === 2', 2, () => countGreater([1, 5, 8, 3], 4)),
    runCheck('countGreater', 'greater-2', 'countGreater([1, 2, 3], 10) === 0', 0, () => countGreater([1, 2, 3], 10)),
    runCheck('countGreater', 'greater-3', 'countGreater([], 0) === 0', 0, () => countGreater([], 0)),
    runCheck('average', 'avg-1', 'average([2, 4, 6]) === 4', 4, () => average([2, 4, 6])),
    runCheck('average', 'avg-2', 'average([1, 2]) === 1.5', 1.5, () => average([1, 2])),
    runCheck('average', 'avg-3', 'average([]) === undefined', undefined, () => average([])),
    runCheck('indexOfNumber', 'idx-1', 'indexOfNumber([10, 20, 30], 20) === 1', 1, () => indexOfNumber([10, 20, 30], 20)),
    runCheck('indexOfNumber', 'idx-2', 'indexOfNumber([5, 5], 5) === 0', 0, () => indexOfNumber([5, 5], 5)),
    runCheck('indexOfNumber', 'idx-3', 'indexOfNumber([10, 20, 30], 7) === -1', -1, () => indexOfNumber([10, 20, 30], 7)),
    runCheck('indexOfNumber', 'idx-4', 'indexOfNumber([], 1) === -1', -1, () => indexOfNumber([], 1)),
    runCheck('sumEvenIndexes', 'even-idx-1', 'sumEvenIndexes([10, 20, 30, 40]) === 40', 40, () => sumEvenIndexes([10, 20, 30, 40])),
    runCheck('sumEvenIndexes', 'even-idx-2', 'sumEvenIndexes([7]) === 7', 7, () => sumEvenIndexes([7])),
    runCheck('sumEvenIndexes', 'even-idx-3', 'sumEvenIndexes([]) === 0', 0, () => sumEvenIndexes([])),
    // Массив проверяем строкой: Object.is сравнивает ссылку, два [2, 4] — разные объекты.
    runCheck('onlyEven', 'only-1', 'onlyEven([1, 2, 3, 4, 10])', '2,4,10', () => onlyEven([1, 2, 3, 4, 10])?.join(',')),
    runCheck('onlyEven', 'only-2', 'onlyEven([1, 3, 5]) пусто', '', () => onlyEven([1, 3, 5])?.join(',')),
    runCheck('onlyEven', 'only-3', 'onlyEven([]) пусто', '', () => onlyEven([])?.join(',')),
  ],
  3: [
    runCheck('getCity', 'city-1', 'getCity({ city: "Бишкек" })', 'Бишкек', () => getCity({ city: 'Бишкек' })),
    runCheck('getCity', 'city-2', 'getCity({}) === undefined', undefined, () => getCity({})),
    runCheck('isActive', 'active-1', 'isActive({ active: true })', true, () => isActive({ active: true })),
    runCheck('isActive', 'active-2', 'isActive({}) === false', false, () => isActive({})),
    runCheck('formatFullName', 'name-1', 'formatFullName Аня Ким', 'Аня Ким', () => formatFullName({ first: 'Аня', last: 'Ким' })),
    runCheck('countFields', 'fields-1', 'countFields({ a: 1, b: 2 }) === 2', 2, () => countFields({ a: 1, b: 2 })),
    runCheck('countFields', 'fields-2', 'countFields({}) === 0', 0, () => countFields({})),
    runCheck('readPrice', 'price-1', 'readPrice USD === 12', 12, () => readPrice({ EUR: 10, USD: 12 }, 'USD')),
    runCheck('readPrice', 'price-2', 'readPrice GBP === undefined', undefined, () => readPrice({ EUR: 10, USD: 12 }, 'GBP')),
    runCheck('livesIn', 'lives-1', 'livesIn Бишкек', true, () => livesIn({ city: 'Бишкек' }, 'Бишкек')),
    runCheck('livesIn', 'lives-2', 'livesIn другой город', false, () => livesIn({ city: 'Ош' }, 'Бишкек')),
    runCheck('livesIn', 'lives-3', 'livesIn без города', false, () => livesIn({}, 'Бишкек')),
    runCheck('formatCard', 'card-1', 'formatCard Аня', 'Аня, Бишкек, 20 лет', () => formatCard({ name: 'Аня', city: 'Бишкек', age: 20 })),
    runCheck('formatCard', 'card-2', 'formatCard Макс', 'Макс, Ош, 7 лет', () => formatCard({ name: 'Макс', city: 'Ош', age: 7 })),
    runCheck('sumValues', 'sum-values-1', 'sumValues({ a: 1, b: 2 }) === 3', 3, () => sumValues({ a: 1, b: 2 })),
    runCheck('sumValues', 'sum-values-2', 'sumValues({}) === 0', 0, () => sumValues({})),
    runCheck('hasKey', 'haskey-1', 'hasKey a', true, () => hasKey({ a: 1 }, 'a')),
    runCheck('hasKey', 'haskey-2', 'hasKey нет b', false, () => hasKey({ a: 1 }, 'b')),
    runCheck('hasKey', 'haskey-3', 'hasKey ноль тоже поле', true, () => hasKey({ a: 0 }, 'a')),
    // Карточку сравниваем строкой полей: новая и старая не должны быть одним объектом в памяти.
    runCheck('withRenamed', 'rename-1', 'withRenamed не портит исходное имя', 'Аня|Анна|Бишкек', () => {
      const user = { name: 'Аня', city: 'Бишкек' }
      const next = withRenamed(user, 'Анна')
      return `${user.name}|${next?.name}|${next?.city}`
    }),
    runCheck('withRenamed', 'rename-2', 'withRenamed копирует город', 'undefined|Макс|Ош', () => {
      // name нет в объекте, но поле в типе опциональное: чтение даёт undefined, а не ошибку типа.
      const user: { name?: string, city?: string } = { city: 'Ош' }
      const next = withRenamed(user, 'Макс')
      return `${user.name}|${next?.name}|${next?.city}`
    }),
  ],
  4: [
    // Массив сравниваем строкой: Object.is смотрит на ссылку, два [2, 4, 6] — разные массивы.
    runCheck('doubleAll', 'double-1', 'doubleAll([1, 2, 3])', '2,4,6', () => doubleAll([1, 2, 3])?.join(',')),
    runCheck('doubleAll', 'double-2', 'doubleAll([-1, 4])', '-2,8', () => doubleAll([-1, 4])?.join(',')),
    runCheck('doubleAll', 'double-4', 'doubleAll([]) пусто', '', () => doubleAll([])?.join(',')),
    runCheck('doubleAll', 'double-3', 'исходный список не меняется', '1,2,3|2,4,6', () => {
      const numbers = [1, 2, 3]
      const next = doubleAll(numbers)
      return `${numbers.join(',')}|${next?.join(',')}`
    }),
    runCheck('namesOf', 'names-1', 'namesOf Аня и Ким', 'Аня,Ким', () => namesOf([{ name: 'Аня' }, { name: 'Ким' }])?.join(',')),
    runCheck('namesOf', 'names-2', 'namesOf пусто', '', () => namesOf([])?.join(',')),
    runCheck('addIndex', 'add-idx-1', 'addIndex([10, 20, 30])', '10,21,32', () => addIndex([10, 20, 30])?.join(',')),
    runCheck('addIndex', 'add-idx-2', 'addIndex([7])', '7', () => addIndex([7])?.join(',')),
    runCheck('keepAdults', 'adults-1', 'keepAdults([17, 18, 20])', '18,20', () => keepAdults([17, 18, 20])?.join(',')),
    runCheck('keepAdults', 'adults-2', 'keepAdults([17, 10]) пусто', '', () => keepAdults([17, 10])?.join(',')),
    runCheck('keepAdults', 'adults-3', 'keepAdults([]) пусто', '', () => keepAdults([])?.join(',')),
    runCheck('findPrice', 'find-1', 'findPrice кофе === 20', 20, () => findPrice([
      { name: 'чай', price: 10 },
      { name: 'кофе', price: 20 },
    ], 'кофе')),
    runCheck('findPrice', 'find-2', 'findPrice берёт первый чай', 10, () => findPrice([
      { name: 'чай', price: 10 },
      { name: 'чай', price: 40 },
    ], 'чай')),
    runCheck('findPrice', 'find-3', 'findPrice сока нет', undefined, () => findPrice([
      { name: 'чай', price: 10 },
    ], 'сок')),
    runCheck('hasExpensive', 'exp-1', 'hasExpensive([10, 30], 20)', true, () => hasExpensive([10, 30], 20)),
    runCheck('hasExpensive', 'exp-2', 'hasExpensive([10, 20], 20)', false, () => hasExpensive([10, 20], 20)),
    runCheck('hasExpensive', 'exp-3', 'hasExpensive пусто', false, () => hasExpensive([], 0)),
    runCheck('allAdults', 'all-1', 'allAdults([18, 20])', true, () => allAdults([18, 20])),
    runCheck('allAdults', 'all-2', 'allAdults([17, 20])', false, () => allAdults([17, 20])),
    runCheck('allAdults', 'all-3', 'allAdults пусто === true', true, () => allAdults([])),
    runCheck('sumWithReduce', 'reduce-1', 'sumWithReduce([1, 2, 3]) === 6', 6, () => sumWithReduce([1, 2, 3])),
    runCheck('sumWithReduce', 'reduce-2', 'sumWithReduce([-2, 5]) === 3', 3, () => sumWithReduce([-2, 5])),
    runCheck('sumWithReduce', 'reduce-3', 'sumWithReduce([]) === 0', 0, () => sumWithReduce([])),
    runCheck('totalPrice', 'total-1', 'totalPrice чек === 23', 23, () => totalPrice([
      { price: 10, count: 2 },
      { price: 3, count: 1 },
    ])),
    runCheck('totalPrice', 'total-2', 'totalPrice пусто === 0', 0, () => totalPrice([])),
    runCheck('adultNames', 'adult-names-1', 'adultNames Аня и Ким', 'Аня,Ким', () => adultNames([
      { name: 'Аня', age: 20 },
      { name: 'Макс', age: 7 },
      { name: 'Ким', age: 18 },
    ])?.join(',')),
    runCheck('adultNames', 'adult-names-2', 'adultNames одни дети', '', () => adultNames([
      { name: 'Макс', age: 7 },
    ])?.join(',')),
    runCheck('adultNames', 'adult-names-3', 'исходные возрасты на месте', '20,7|Аня', () => {
      const users = [
        { name: 'Аня', age: 20 },
        { name: 'Макс', age: 7 },
      ]
      const names = adultNames(users)
      return `${users.map((user) => user.age).join(',')}|${names?.join(',')}`
    }),
  ],
}))

const passedByLesson = computed(() => ({
  1: checksByLesson.value[1].filter((check) => check.ok).length,
  2: checksByLesson.value[2].filter((check) => check.ok).length,
  3: checksByLesson.value[3].filter((check) => check.ok).length,
  4: checksByLesson.value[4].filter((check) => check.ok).length,
}))

// Правый столбец карточки. Новая задача: то же имя в runCheck и в checksFor(урок, 'имя').
const checksFor = (lessonId: LessonId, task: string) => {
  return checksByLesson.value[lessonId].filter((check) => check.task === task)
}
</script>
