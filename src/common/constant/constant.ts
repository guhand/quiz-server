export const ROLES = ['Super Admin', 'Admin', 'User'];

export const SUBJECTS = ['JavaScript', 'Embedded'];

export const POSITIONS = ['JavaScript Developer', 'Embedded Developer'];

export const REQUIRED_COLUMNS_FOR_EXCEL_UPLOAD = [
  'FirstName',
  'LastName',
  'Email',
  'Mobile',
  'DOB',
  'College',
  'Degree',
  'Specialization',
];

/**
 * @constant USERS
 * @description Predefined user data for initialization.
 */
export const USERS = [
  {
    firstName: 'Tamil',
    lastName: 'Selvam',
    email: 'tamilselvammuthuswamy@gmail.com',
    mobile: '8610525468',
    roleId: 1,
  },
  {
    firstName: 'Guhan',
    lastName: 'Dhakshanamurthy',
    email: 'guhandhakshanamurthy@gmail.com',
    mobile: '8438379027',
    roleId: 1,
  },
];

/**
 * @constant JS_QUESTIONS
 * @description Predefined JavaScript quesitions for initialization.
 */
export const JS_QUESTIONS = [
  {
    question:
      "What is the purpose of the 'use strict' statement in JavaScript?",
    options: [
      {
        option: 'To enable strict mode, catching common coding errors',
        isCorrect: true,
      },
      { option: 'To include external libraries', isCorrect: false },
      { option: 'To define a variable', isCorrect: false },
      { option: 'To declare a function', isCorrect: false },
    ],
  },
  {
    question:
      "What is the difference between 'let', 'const', and 'var' for variable declaration?",
    options: [
      {
        option:
          "'let' allows block-scoped variables, 'const' is for constants, and 'var' is function-scoped",
        isCorrect: true,
      },
      {
        option:
          "'const' is for constants, 'let' is function-scoped, and 'var' is block-scoped",
        isCorrect: false,
      },
      {
        option:
          "'var' is for constants, 'let' is block-scoped, and 'const' is function-scoped",
        isCorrect: false,
      },
      {
        option:
          "'const' allows block-scoped variables, 'let' is for constants, and 'var' is function-scoped",
        isCorrect: false,
      },
    ],
  },
  {
    question: 'Explain the concept of closures in JavaScript.',
    options: [
      {
        option:
          'Functions remember the scope in which they were created, even if they are executed outside that scope',
        isCorrect: true,
      },
      {
        option: 'Functions cannot access variables outside their own scope',
        isCorrect: false,
      },
      {
        option: 'Closures are used to close the browser window',
        isCorrect: false,
      },
      {
        option:
          'Closures refer to the process of closing unused connections in the code',
        isCorrect: false,
      },
    ],
  },
  {
    question:
      "What is the purpose of the 'async' and 'await' keywords in JavaScript?",
    options: [
      {
        option:
          "'async' is used to declare an asynchronous function, and 'await' is used to wait for a Promise to resolve",
        isCorrect: true,
      },
      {
        option:
          "'async' is used to make a function synchronous, and 'await' is used to delay execution",
        isCorrect: false,
      },
      {
        option:
          "'await' is used to declare an asynchronous function, and 'async' is used to wait for a Promise to resolve",
        isCorrect: false,
      },
      {
        option: "'await' is used to handle errors in asynchronous functions",
        isCorrect: false,
      },
    ],
  },
  {
    question: 'How does prototypal inheritance work in JavaScript?',
    options: [
      {
        option:
          'Objects inherit properties and methods from their prototype, forming a chain',
        isCorrect: true,
      },
      {
        option: 'Objects inherit properties only from their immediate parent',
        isCorrect: false,
      },
      {
        option: 'Objects inherit methods only from their immediate parent',
        isCorrect: false,
      },
      {
        option: 'Prototypal inheritance is not a feature in JavaScript',
        isCorrect: false,
      },
    ],
  },
  {
    question:
      "What is the difference between 'null' and 'undefined' in JavaScript?",
    options: [
      {
        option:
          "'null' is an assignment value representing the absence of an object, and 'undefined' is a variable that has been declared but not assigned",
        isCorrect: true,
      },
      {
        option:
          "'undefined' is an assignment value representing the absence of an object, and 'null' is a variable that has been declared but not assigned",
        isCorrect: false,
      },
      {
        option: "'null' is a primitive data type, and 'undefined' is an object",
        isCorrect: false,
      },
      {
        option:
          "There is no difference; 'null' and 'undefined' can be used interchangeably",
        isCorrect: false,
      },
    ],
  },
  {
    question: 'What is the event loop in JavaScript?',
    options: [
      {
        option:
          'The event loop is responsible for executing code, collecting and processing events, and executing queued sub-tasks',
        isCorrect: true,
      },
      {
        option:
          'The event loop is a feature used to create animations in web development',
        isCorrect: false,
      },
      {
        option: 'The event loop is a type of loop used to iterate over arrays',
        isCorrect: false,
      },
      {
        option:
          'The event loop is used to handle errors in asynchronous functions',
        isCorrect: false,
      },
    ],
  },
  {
    question: "Explain the difference between '== and '===' in JavaScript.",
    options: [
      {
        option:
          "'===' checks both value and type equality, while '==' only checks value equality",
        isCorrect: true,
      },
      {
        option:
          "'==' checks both value and type equality, while '===' only checks value equality",
        isCorrect: false,
      },
      {
        option:
          "'===' is used for assignment, while '==' is used for comparison",
        isCorrect: false,
      },
      {
        option:
          "'==' is used for strict equality, while '===' is used for loose equality",
        isCorrect: false,
      },
    ],
  },
  {
    question: "What is the purpose of the 'this' keyword in JavaScript?",
    options: [
      {
        option:
          'It refers to the current instance of the object and is used to access its properties and methods',
        isCorrect: true,
      },
      {
        option: 'It is a variable that cannot be reassigned',
        isCorrect: false,
      },
      { option: 'It is used to declare a new object', isCorrect: false },
      {
        option: 'It refers to the parent object in a nested object structure',
        isCorrect: false,
      },
    ],
  },
  {
    question: "What is the purpose of the 'Array.map()' method in JavaScript?",
    options: [
      {
        option:
          'To create a new array by applying a function to each element of an existing array',
        isCorrect: true,
      },
      {
        option: 'To filter out elements from an array based on a condition',
        isCorrect: false,
      },
      { option: 'To reduce an array to a single value', isCorrect: false },
      { option: 'To sort the elements of an array', isCorrect: false },
    ],
  },
];

/**
 * @constant EMBEDDED_QUESTIONS
 * @description Predefined Embedded quesitions for initialization.
 */
export const EMBEDDED_QUESTIONS = [
  {
    question:
      'Explain the difference between microcontrollers and microprocessors.',
    options: [
      {
        option:
          'Microcontrollers have integrated memory and peripherals, while microprocessors require external components',
        isCorrect: true,
      },
      {
        option:
          'Microprocessors are used in embedded systems, while microcontrollers are used in desktop computers',
        isCorrect: false,
      },
      {
        option:
          'Microcontrollers focus on processing tasks, while microprocessors handle control tasks',
        isCorrect: false,
      },
      {
        option:
          'There is no significant difference between microcontrollers and microprocessors',
        isCorrect: false,
      },
    ],
  },
  {
    question: 'What is the purpose of an Interrupt in embedded systems?',
    options: [
      {
        option:
          'To temporarily halt the normal execution of a program to handle a specific event',
        isCorrect: true,
      },
      {
        option: 'To restart the embedded system in case of a failure',
        isCorrect: false,
      },
      { option: 'To schedule tasks and allocate resources', isCorrect: false },
      { option: 'To debug the code during development', isCorrect: false },
    ],
  },
  {
    question:
      'Explain the concept of Real-Time Operating Systems (RTOS) in embedded development.',
    options: [
      {
        option:
          'RTOS is designed to provide predictable and timely response to events in real-time applications',
        isCorrect: true,
      },
      {
        option: 'RTOS is only used for debugging purposes in embedded systems',
        isCorrect: false,
      },
      {
        option:
          'RTOS is primarily used for graphical user interfaces in embedded systems',
        isCorrect: false,
      },
      {
        option: 'RTOS is a programming language specific to embedded systems',
        isCorrect: false,
      },
    ],
  },
  {
    question: 'What is firmware in the context of embedded systems?',
    options: [
      {
        option:
          'Software that is permanently stored in hardware, often on ROM or Flash memory',
        isCorrect: true,
      },
      {
        option: 'Temporary software used for testing and debugging',
        isCorrect: false,
      },
      { option: 'Hardware components of an embedded system', isCorrect: false },
      {
        option: 'A type of hardware architecture in embedded systems',
        isCorrect: false,
      },
    ],
  },
  {
    question:
      'How does SPI (Serial Peripheral Interface) communication work in embedded systems?',
    options: [
      {
        option:
          'SPI is a synchronous serial communication protocol where data is sent between devices using a master-slave architecture',
        isCorrect: true,
      },
      {
        option:
          'SPI is an asynchronous serial communication protocol used for wireless communication',
        isCorrect: false,
      },
      {
        option:
          'SPI is a parallel communication protocol used for high-speed data transfer',
        isCorrect: false,
      },
      {
        option:
          'SPI is a protocol specific to audio communication in embedded systems',
        isCorrect: false,
      },
    ],
  },
  {
    question: 'What is the purpose of Watchdog Timers in embedded systems?',
    options: [
      {
        option:
          'To reset the system if it hangs or fails to respond within a predefined time interval',
        isCorrect: true,
      },
      {
        option: 'To monitor user interactions with the embedded system',
        isCorrect: false,
      },
      {
        option: 'To measure the execution time of specific tasks in the system',
        isCorrect: false,
      },
      {
        option: 'To synchronize multiple devices in an embedded system',
        isCorrect: false,
      },
    ],
  },
  {
    question:
      'Explain the concept of GPIO (General Purpose Input/Output) in embedded systems.',
    options: [
      {
        option:
          'GPIO pins can be configured as either input or output and are used for interfacing with external devices',
        isCorrect: true,
      },
      {
        option: 'GPIO pins are only used for powering the embedded system',
        isCorrect: false,
      },
      {
        option:
          'GPIO pins are specific to graphical user interfaces in embedded systems',
        isCorrect: false,
      },
      {
        option:
          'GPIO pins are responsible for managing real-time tasks in embedded systems',
        isCorrect: false,
      },
    ],
  },
  {
    question: 'What is the purpose of Flash memory in embedded systems?',
    options: [
      {
        option:
          'To store program code and data persistently in non-volatile memory',
        isCorrect: true,
      },
      {
        option: 'To provide temporary storage for running applications',
        isCorrect: false,
      },
      {
        option: 'To enable wireless communication in embedded systems',
        isCorrect: false,
      },
      {
        option: 'To execute real-time tasks in embedded systems',
        isCorrect: false,
      },
    ],
  },
  {
    question: 'How does DMA (Direct Memory Access) benefit embedded systems?',
    options: [
      {
        option:
          'DMA allows peripherals to transfer data directly to and from memory without CPU intervention, improving overall system performance',
        isCorrect: true,
      },
      {
        option: 'DMA is used for debugging purposes in embedded systems',
        isCorrect: false,
      },
      {
        option:
          'DMA is responsible for managing power consumption in embedded systems',
        isCorrect: false,
      },
      {
        option: 'DMA is specific to audio processing in embedded systems',
        isCorrect: false,
      },
    ],
  },
  {
    question:
      "What is the purpose of the 'volatile' keyword in embedded C programming?",
    options: [
      {
        option:
          'To indicate that a variable can be changed unexpectedly by external factors, preventing compiler optimization',
        isCorrect: true,
      },
      {
        option: 'To specify a constant variable in embedded C programming',
        isCorrect: false,
      },
      {
        option:
          'To declare a variable with a fixed value that cannot be modified',
        isCorrect: false,
      },
      {
        option: 'To allocate memory dynamically during runtime',
        isCorrect: false,
      },
    ],
  },
];
