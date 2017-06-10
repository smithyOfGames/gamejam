package consolelog

import (
	"fmt"
	"strings"
	"time"
)

type LogLevel int

const (
	ERROR LogLevel = iota
	WARNING
	INFO
	DEBUG
)

var timeFormat = "15:04:05.000"
var logLevel = INFO
var logLevels = map[string]LogLevel{
	"error":   ERROR,
	"warning": WARNING,
	"info":    INFO,
	"debug":   DEBUG,
}

func SetLogLevel(newLevel LogLevel) LogLevel {
	oldLevel := logLevel
	logLevel = newLevel
	return oldLevel
}

func SetLogLevelByString(newLevel string) (LogLevel, error) {
	oldLevel := logLevel
	newLogLevelValue, ok := logLevels[strings.ToLower(newLevel)]
	if ok {
		logLevel = newLogLevelValue
	} else {
		err := fmt.Errorf("'%s' is invalid value for log level", newLevel)
		Error(err.Error())
		return oldLevel, err
	}

	return oldLevel, nil
}

func SetDatetimeFormat(format string) string {
	oldFormat := timeFormat
	timeFormat = format
	return oldFormat
}

func Error(v ...interface{}) {
	if logLevel >= ERROR {
		out(" Err ", fmt.Sprint(v...))
	}
}

func Errorf(format string, v ...interface{}) {
	if logLevel >= ERROR {
		out(" Err ", format, v...)
	}
}

func Warn(v ...interface{}) {
	if logLevel >= WARNING {
		out(" Wrn ", fmt.Sprint(v...))
	}
}

func Warnf(format string, v ...interface{}) {
	if logLevel >= WARNING {
		out(" Wrn ", format, v...)
	}
}

func Info(v ...interface{}) {
	if logLevel >= INFO {
		out(" Inf ", fmt.Sprint(v...))
	}
}

func Infof(format string, v ...interface{}) {
	if logLevel >= INFO {
		out(" Inf ", format, v...)
	}
}

func Debug(v ...interface{}) {
	if logLevel >= DEBUG {
		out(" Dbg ", fmt.Sprint(v...))
	}
}

func Debugf(format string, v ...interface{}) {
	if logLevel >= DEBUG {
		out(" Dbg ", format, v...)
	}
}

func out(level string, format string, v ...interface{}) {
	fmt.Printf(
		strings.Join(
			[]string{
				time.Now().Format(timeFormat),
				level,
				format,
				"\n",
			},
			""),
		v...,
	)
}
