import Timer from "timer";
import Digital from "pins/digital";

import SMBus from "pins/smbus";
const constants = {
  I2C_ADDR_PRIMARY: 0x0a,
  I2C_ADDR_ALTERNATIVE: 0x0b,
  CHIP_ID: 0xba11,
  VERSION: 1,
  REG_LED_RED: 0x00,
  REG_LED_GRN: 0x01,
  REG_LED_BLU: 0x02,
  REG_LED_WHT: 0x03,
  REG_LEFT: 0x04,
  REG_RIGHT: 0x05,
  REG_UP: 0x06,
  REG_DOWN: 0x07,
  REG_SWITCH: 0x08,
  MSK_CLICKED: 0x80,
  MSK_CLICK_STATE_UPDATE: 0x01,
  MSK_SWITCH_STATE: 0b10000000,
  REG_USER_FLASH: 0xd0,
  REG_FLASH_PAGE: 0xf0,
  REG_INT: 0xf9,
  MSK_INT_TRIGGERED: 0b00000001,
  MSK_INT_OUT_EN: 0b00000010,
  REG_CHIP_ID_L: 0xfa,
  RED_CHIP_ID_H: 0xfb,
  REG_VERSION: 0xfc,
  REG_I2C_ADDR: 0xfd,
  REG_CTRL: 0xfe,
  MSK_CTRL_SLEEP: 0b00000001,
  MSK_CTRL_RESET: 0b00000010,
  MSK_CTRL_FREAD: 0b00000100,
  MSK_CTRL_FWRITE: 0b00001000,
};

class TrackBall {
  i2c_address: number;
  i2c_bus: SMBus;
  interrupt_pin?: number;
  timeout: number;
  constructor(
    address = constants.I2C_ADDR_PRIMARY,
    i2c_bus = 1,
    timeout = 5,
    interrupt_pin?: number
  ) {
    this.i2c_address = address;
    this.i2c_bus = new SMBus({ sda: 23, scl: 22, address, hz: 250_000 });
    this.interrupt_pin = interrupt_pin;
    this.timeout = timeout;
    trace("SMBus initialized");
    if (this.readChipId() !== constants.CHIP_ID) {
      throw new Error("Chip ID does not match Pimoroni TrackBall chip ID");
    }
  }
  readChipId() {
    const uInt8Array = this.i2c_bus.readBlock(constants.REG_CHIP_ID_L, 2);
    return new DataView(uInt8Array.buffer, 0).getUint16(0, true);
  }
}

let lightOn = false;
trace("Run");
const trackball = new TrackBall();
trace(String(trackball.readChipId()));
Timer.repeat(() => {
  Digital.write(13, lightOn ? 1 : 0);
  lightOn = !lightOn;
}, 500);
