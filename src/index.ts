import { configure, getLogger } from 'log4js'

import type { Logger } from 'log4js'
export type { Logger } from 'log4js'

// Log Levels
//
// OFF    Designates no log messages should be shown
// MARK   Designates an event that will almost always be logged. Useful for temporary logging.
// FATAL  Designates very severe error events that will presumably lead the application to abort.
// ERROR  Designates error events that might still allow the application to continue running.
// WARN   Designates potentially harmful situations.
// INFO   Designates informational messages that highlight the progress of the application at coarse-grained level.
// DEBUG  Designates fine-grained informational events that are most useful to debug an application.
// TRACE  Designates finer-grained informational events than the DEBUG.
// ALL    Designates all log events should be shown (equivalent to TRACE)

enum LogLevel {
  OFF = 'OFF',
  MARK = 'MARK',
  FATAL = 'FATAL',
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  TRACE = 'TRACE',
  ALL = 'ALL',
}

export default function createLogger(logLevel: string): Logger {
  const LOG_LEVEL = logLevel.toUpperCase()

  if (!isLogLevel(LOG_LEVEL)) {
    throw new Error(
      `The log level '${LOG_LEVEL}' specified in config is not an acceptable log level.`,
    )
  }

  configure({
    appenders: {
      out: {
        type: 'stdout',

        // Pattern Format documentation: https://github.com/log4js-node/log4js-node/blob/master/docs/layouts.md#pattern-format
        layout: { type: 'pattern', pattern: '%[%-5p%] %m' },
      },

      // Define a custom pattern to use when LOG_LEVEL=TRACE that includes filenames and line numbers in the log
      trace: {
        type: 'stdout',
        layout: { type: 'pattern', pattern: '%[%-5p %f:%-3l%]\t%m' },
      },
    },
    categories: {
      default: { appenders: ['out'], level: LOG_LEVEL },
      trace: { appenders: ['trace'], level: LOG_LEVEL, enableCallStack: true },
    },
  })

  let logCategory = 'default'

  // If LOG_LEVEL = TRACE|ALL, use the logger that shows filenames and line numbers
  if ([LogLevel.TRACE, LogLevel.ALL].includes(LOG_LEVEL)) {
    logCategory = 'trace'
  }

  return getLogger(logCategory)
}

/**
 * A type guard function that determines if a provided string is a LogLevel enum member.
 *
 * @param member - A string which may or may not be a LogLevel.
 *
 * @returns A type predicate (boolean for type narrowing) indicating whether the string is a LogLevel.
 */
function isLogLevel(member: string): member is LogLevel {
  return Object.values(LogLevel).includes(member as LogLevel)
}
