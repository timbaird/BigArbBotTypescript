import ArbLogger from "./classes/ArbLogger"

const logger: ArbLogger = new ArbLogger("TEST_PAIR", "../../../logs/");

logger.log('info', 'Halelujah');