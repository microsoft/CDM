package com.microsoft.commondatamodel.objectmodel.utilities;

import java.util.List;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.core.Appender;
import org.apache.logging.log4j.core.LogEvent;
import org.apache.logging.log4j.core.Logger;
import org.apache.logging.log4j.core.LoggerContext;
import org.apache.logging.log4j.core.config.Configuration;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.testng.Assert;

/**
 * Intercept a logger from the specified class and adds a mock appender to the logger.
 * Must call {@link InterceptLog#verifyNumLogEvents(int)} to start capturing logs.
 * Use try-with-resources when using this class to ensure that mock appender is removed from the
 * logger after the test, or call {@link InterceptLog#close()} manually.
 */
public class InterceptLog implements AutoCloseable {
  private final Appender appender;
  private final ArgumentCaptor<LogEvent> logEventCaptor;
  private final Logger testLogger;

  /**
   * Adds a mock appender to the test logger to capture logged error messages.
   */
  public InterceptLog(final Class<?> classInterceptLogsFor) {
    logEventCaptor = ArgumentCaptor.forClass(LogEvent.class);

    appender = Mockito.mock(Appender.class);
    Mockito.doReturn("logAppender").when(appender).getName();
    Mockito.doReturn(true).when(appender).isStarted();

    final LoggerContext ctx = (LoggerContext) LogManager.getContext(false);
    final Configuration config = ctx.getConfiguration();

    testLogger = (Logger) LogManager.getLogger(classInterceptLogsFor);
    config.addLoggerAppender(testLogger, appender);
    testLogger.setLevel(Level.ERROR); // Only capture errors.
    ctx.updateLoggers();
  }

  public void assertLoggedMessage(final String message) {
    Assert.assertEquals(message, logEventCaptor.getValue().getMessage().getFormattedMessage());
  }

  public void assertLoggedLevel(final Level level) {
    Assert.assertEquals(level, logEventCaptor.getValue().getLevel());
  }

  /**
   * Start capturing logs and ensure the number of logs captured.
   *
   * @param numEvents Number of logs to capture.
   * @return the actual number of logs captured.
   */
  public List<LogEvent> verifyNumLogEvents(final int numEvents) {
    Mockito.verify(appender, Mockito.times(numEvents)).append(logEventCaptor.capture());
    return logEventCaptor.getAllValues();
  }

  @Override
  public void close() {
    testLogger.removeAppender(appender);
  }

  public Appender getAppender() {
    return appender;
  }

  public ArgumentCaptor<LogEvent> getLogEventCaptor() {
    return logEventCaptor;
  }

  public Logger getTestLogger() {
    return testLogger;
  }
}
