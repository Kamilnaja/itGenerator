var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function () {
    var config = {
        pesel: {
            birthDay: '20',
            birthMonth: '06',
            birthYear: '1988',
            sex: 'M'
        },
        iban: {
            country: 'PL',
            spaces: 'false'
        },
        debugOn: false
    };
    var Util = /** @class */ (function () {
        function Util() {
        }
        Util.getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        Util.getRandomTableItem = function (array) {
            return array[Util.getRandomInt(0, array.length - 1)];
        };
        Util.getErrorInfo = function (type) {
            return type + " is not ok ";
        };
        return Util;
    }());
    var Generator = /** @class */ (function () {
        function Generator() {
            this.requiredLength = 0;
            this.weights = [];
        }
        ;
        Generator.prototype.preparedInput = function (value) {
            if (typeof value === 'string') {
                value = value.split('');
            }
            else if (typeof value === 'object') {
                value = value.join(',');
            }
            return value;
        };
        Generator.prototype.calculateNumsSumTimesWeights = function (value, trim) {
            var _this = this;
            this.preparedInput(value);
            var sliceEnd;
            trim ? sliceEnd = value.length - 1 : sliceEnd = value.length;
            return String(this.preparedInput(value))
                .split(',')
                .slice(0, sliceEnd)
                .map(function (val, index) { return Number(val) * _this.weights[index]; })
                .reduce(function (a, b) { return a + b; }, 0);
        };
        ;
        // return number values for string, starts with 10 for 'a'
        Generator.prototype.mapToNumbers = function () {
            return function (item) {
                return isNaN(item) ? item.charCodeAt() - 55 : item;
            };
        };
        return Generator;
    }());
    var IDNumber = /** @class */ (function (_super) {
        __extends(IDNumber, _super);
        function IDNumber() {
            var _this = _super.call(this) || this;
            _this.name = 'IDNumber';
            _this.weights = [7, 3, 1, 7, 3, 1, 7, 3];
            _this.requiredLength = 9;
            return _this;
        }
        IDNumber.prototype.generate = function () {
            var generatedIDNumber = [];
            for (var i = 0; i < 3; i++) {
                generatedIDNumber.push(String.fromCharCode(Util.getRandomInt(65, 90)));
            }
            for (var i = 3; i < this.requiredLength - 1; i++) {
                generatedIDNumber[i] = Util.getRandomInt(0, 9);
            }
            var checkSum = this.calculateCheckSum(generatedIDNumber);
            generatedIDNumber.splice(3, 0, checkSum);
            return generatedIDNumber.join('');
        };
        IDNumber.prototype.calculateCheckSum = function (idNumber) {
            return this.calculateNumsSumTimesWeights((this.parseIDNumberToValues(idNumber)), false) % 10;
        };
        ;
        IDNumber.prototype.parseIDNumberToValues = function (idNumber) {
            if (typeof idNumber === 'object') {
                return idNumber.map(this.mapToNumbers());
            }
            else if (typeof idNumber === 'string') {
                return idNumber.split(',').map(this.mapToNumbers());
            }
        };
        IDNumber.prototype.validate = function (idNumber) {
            if (idNumber.length !== this.requiredLength) {
                console.error("Wrong " + this.name + " length: " + idNumber + " ");
                return false;
            }
            else {
                var arrToEvaluate = [];
                for (var i = 0; i < 3; i++) {
                    arrToEvaluate.push(idNumber[i]);
                }
                for (var i = 4; i < this.requiredLength; i++) {
                    arrToEvaluate.push(idNumber[i]);
                }
                var checkSum = (this.calculateNumsSumTimesWeights(this.parseIDNumberToValues(arrToEvaluate)) % 10);
                return Number(checkSum) === Number(idNumber[3]);
            }
        };
        return IDNumber;
    }(Generator));
    var Regon = /** @class */ (function (_super) {
        __extends(Regon, _super);
        function Regon() {
            var _this = _super.call(this) || this;
            _this.name = 'REGON';
            _this.weights = [8, 9, 2, 3, 4, 5, 6, 7];
            _this.requiredLength = 9;
            return _this;
        }
        Regon.prototype.generate = function () {
            var generatedRegon = [];
            for (var i = 0; i < this.requiredLength - 1; i++) {
                generatedRegon.push(Util.getRandomInt(0, 9));
            }
            generatedRegon.push(this.calculateCheckSum(generatedRegon) % 10);
            return generatedRegon.join('');
        };
        Regon.prototype.calculateCheckSum = function (regon) {
            return this.calculateNumsSumTimesWeights(regon, false) % 11;
        };
        ;
        Regon.prototype.validate = function (regon) {
            console.info(regon);
            if (regon.length !== this.requiredLength) {
                console.error("Wrong " + this.name + " length: " + regon + " ");
                return false;
            }
            else {
                var checkSum = (this.calculateNumsSumTimesWeights(regon, true) % 11) % 10;
                return Number(checkSum) === Number(regon.split('')[regon.length - 1]);
            }
        };
        ;
        return Regon;
    }(Generator));
    // trying with better implementation
    var Iban2 = /** @class */ (function (_super) {
        __extends(Iban2, _super);
        function Iban2() {
            var _this = _super.call(this) || this;
            _this.requiredLength = 28;
            _this.name = 'IBAN';
            _this.departmentNumber = [];
            _this.departmentNumberLength = 8;
            _this.departmentNumberWeights = [3, 9, 7, 1, 3, 9, 7];
            return _this;
        }
        Iban2.prototype.generate = function () {
            var _this = this;
            // departmentNumber
            for (var i = 0; i < this.departmentNumberLength - 1; i++) {
                this.departmentNumber.push(Util.getRandomInt(0, 9));
            }
            var result = this.departmentNumber
                .slice(0, this.departmentNumberLength - 1)
                .map(function (item, i) { return Number(item) * _this.departmentNumberWeights[i]; })
                .reduce(function (a, b) { return a + b; }, 0)
                % 10; // todo - use generic
            var checkSum = 10 - result;
            this.departmentNumber.push(checkSum);
            return this.departmentNumber;
        };
        Iban2.prototype.validate = function (value) {
            var _this = this;
            if (typeof value === 'number') {
                value = String(value).split('');
            }
            var result = value
                .slice(0, this.departmentNumberLength - 1)
                .map(function (item, i) { return Number(item) * _this.departmentNumberWeights[i]; })
                .reduce(function (a, b) { return a + b; }, 0)
                % 10; // todo - use generic
            var checkSum = 10 - result;
            return Number(value[this.departmentNumberLength - 1]) === checkSum;
        };
        return Iban2;
    }(Generator));
    var Iban = /** @class */ (function (_super) {
        __extends(Iban, _super);
        function Iban() {
            var _this = _super.call(this) || this;
            _this.name = 'IBAN';
            _this.requiredLength = 28;
            config.iban.country ? _this.countryCode = config.iban.country : _this.countryCode = 'PL';
            return _this;
        }
        Iban.prototype.generate = function () {
            var generatedIban = [];
            generatedIban.push(this.countryCode);
            for (var i = 0; i < this.requiredLength - 17; i++) {
                generatedIban.push(Util.getRandomInt(0, 9));
            }
            var tempIban = String(generatedIban);
            for (var i = 0; i < 4; i++) {
                generatedIban.push(generatedIban.shift());
            }
            console.log(">>>> gen " + generatedIban);
            console.log("TI: " + tempIban);
            generatedIban = generatedIban
                .join('')
                .split('')
                .map(this.mapToNumbers());
            var checkSum = Number(generatedIban.join('')) % 97;
            console.log("gib: " + generatedIban + ", cs: " + checkSum);
            generatedIban = String(Number(generatedIban.join('')) - checkSum + 1);
            console.assert(Number(generatedIban) % 97 === 1, "wrong checkSum " + Number(generatedIban) % 97);
            console.log(">>>> gen " + generatedIban);
            console.log(">>> GENEND: " + generatedIban + ", snap: " + tempIban);
            return String(tempIban) + '0000';
        };
        Iban.prototype.validate = function (iban) {
            if (typeof iban === 'object') {
                iban = iban.join('');
            }
            console.info("iban: " + iban + " len: " + iban.length + " ");
            iban = iban
                .trim()
                .replace(/\ /g, '')
                .replace(/\-/g, '')
                .replace(/PL/g, 'P,L')
                .split(',')
                .map(this.mapToNumbers());
            console.info("IBAN: " + iban);
            if (String(iban.join(',')).length !== this.requiredLength) {
                console.error("Wrong length of iban: " + iban.join(',').split(',') + " " + iban.length + " ");
                return false;
            }
            else {
                for (var i = 0; i < 4; i++) {
                    iban.push(iban.shift());
                }
                console.info("IBANMORF: " + iban);
                var firstPart = iban.slice(0, 16);
                var secondPart = iban.slice(16);
                console.info("FirstPart: " + firstPart);
                console.info("SecondPart: " + secondPart);
                var firstModulo = Number(firstPart.join('')) % 97;
                console.info("firstModulo: " + firstModulo);
                secondPart.unshift(firstModulo);
                console.info("secondPart: " + secondPart);
                var checkSum = secondPart.join('') % 97;
                console.info("CHECKSUM: " + checkSum);
                return String(checkSum) === '1';
            }
        };
        return Iban;
    }(Generator));
    var Pesel = /** @class */ (function (_super) {
        __extends(Pesel, _super);
        function Pesel(year, month, day) {
            var _this = _super.call(this) || this;
            _this.name = 'PESEL';
            _this.requiredLength = 11;
            _this.weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
            _this.femaleNums = [0, 2, 4, 6, 8];
            _this.maleNums = [1, 3, 5, 7, 9];
            _this.months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ];
            _this.year = year;
            _this.month = month;
            _this.day = day;
            return _this;
        }
        Pesel.prototype.generate = function () {
            var generatedPesel = [];
            generatedPesel.push(this.setYear(this.year));
            var tempMonth = this.setMonth(this.month);
            generatedPesel.push(tempMonth);
            var tempDay = this.setDay(this.day, tempMonth);
            generatedPesel.push(tempDay);
            for (var i = 0; i < 3; i++) {
                generatedPesel.push(Util.getRandomInt(0, 9));
            }
            generatedPesel.push(this.setSex());
            generatedPesel.push(this.calculateCheckSum(generatedPesel) % 10);
            return generatedPesel.join('');
        };
        Pesel.prototype.setDay = function (givenDay, month) {
            var day;
            var birthDay = givenDay;
            if (!birthDay) {
                console.warn('Missing value: config.pesel.birthDay');
                console.log("Generating random value for config.pesel.birthDay");
                day = this.generateRandomDay(month);
            }
            else if (Number(birthDay) > 31) {
                console.error("Wrong day value " + birthDay + " ");
                day = this.generateRandomDay(month);
            }
            else if (Number(birthDay) >= 30 && config.pesel.birthMonth === '2') {
                console.warn("Wrong days value for february!: " + birthDay + " ");
                console.log("Generating random value for config.pesel.birthDay");
                day = this.generateRandomDay(month);
            }
            else if (Number(birthDay) >= 31 && config.pesel.birthMonth === '4' ||
                Number(birthDay) >= 31 && config.pesel.birthMonth === '6' ||
                Number(birthDay) >= 31 && config.pesel.birthMonth === '9' ||
                Number(birthDay) >= 31 && config.pesel.birthMonth === '11') {
                console.warn("Wrong days value for " + this.months[Number(config.pesel.birthMonth) - 1]);
                day = this.generateRandomDay(month);
                console.log("Generating random value for config.pesel.birthDay " + birthDay);
            }
            else if (config.pesel.birthDay.length === 1) {
                day = "0" + config.pesel.birthDay + " ";
            }
            else if (config.pesel.birthDay.length === 2) {
                day = "" + config.pesel.birthDay;
            }
            return day;
        };
        Pesel.prototype.setMonth = function (givenMonth) {
            var month;
            if (Number(givenMonth) > 12 || !givenMonth) {
                console.log("Wrong month value: " + config.pesel.birthMonth + " ");
                month = this.generateRandomMonth();
            }
            else if (Number(config.pesel.birthMonth) <= 12) {
                month = this.calculatePeselMonth(givenMonth);
            }
            return month;
        };
        Pesel.prototype.calculatePeselMonth = function (month) {
            var year = Number(config.pesel.birthYear); // not always
            if (Number(config.pesel.birthMonth) > 12) {
                console.log('Wrong month value, generate my own');
                month = this.generateRandomMonth();
            }
            else if (year >= 1800 && year <= 1899) {
                month = Number(config.pesel.birthMonth) + 80;
            }
            else if (year >= 1900 && year <= 1990) {
                month = config.pesel.birthMonth;
            }
            else if (year >= 2000 && year <= 2099) {
                month = Number(config.pesel.birthMonth) + 20;
            }
            else if (year >= 2100 && year <= 2199) {
                month = Number(config.pesel.birthMonth) + 40;
            }
            else if (year >= 2200 && year <= 2299) {
                month = Number(config.pesel.birthMonth) + 60;
            }
            return month;
        };
        Pesel.prototype.generateRandomMonth = function () {
            var rand = Util.getRandomInt(1, 12);
            if (String(rand).length === 1) {
                return "0" + rand + " ";
            }
            else {
                return String(rand);
            }
        };
        Pesel.prototype.generateRandomDay = function (month) {
            var lastDayOfMonth = 31;
            var thirtyOneDaysMonths = [1, 3, 5, 7, 8, 10, 12];
            var thirtyDaysMonths = [4, 6, 9, 11];
            if (thirtyOneDaysMonths.some(function (item) { return item === Number(month); })) {
                lastDayOfMonth = 31;
            }
            else if (thirtyDaysMonths.some(function (item) { return item === Number(month); })) {
                lastDayOfMonth = 30;
            }
            else if (Number(month) === 2) {
                lastDayOfMonth = 29;
            }
            else {
                console.error("Wrong month value!");
            }
            var rand = Util.getRandomInt(1, lastDayOfMonth);
            if (String(rand).length === 1) {
                return "0" + rand + " ";
            }
            else {
                return String(rand);
            }
        };
        Pesel.prototype.setSex = function () {
            var sex;
            if (!config.pesel.sex) {
                console.log("No pesel sex value or wrong value: " + config.pesel.sex + ".Generate my own");
                var nums = this.femaleNums.concat(this.maleNums).sort();
                sex = Util.getRandomTableItem(nums);
            }
            else if (config.pesel.sex === 'F') {
                sex = Util.getRandomTableItem(this.femaleNums);
            }
            else if (config.pesel.sex === 'M') {
                sex = Util.getRandomTableItem(this.maleNums);
            }
            return sex;
        };
        Pesel.prototype.setYear = function (givenYear) {
            var year;
            if (!givenYear) {
                console.log("No year value.Generate my own");
                year = String(this.generateRandomYear()).slice(2, 4);
            }
            else if (String(givenYear).length === 4) {
                year = String(givenYear).slice(2, 4);
            }
            return year;
        };
        ;
        // generate year from 1940 to 2019
        Pesel.prototype.generateRandomYear = function () {
            return Util.getRandomInt(1940, 2019);
        };
        Pesel.prototype.calculateCheckSum = function (pesel) {
            if (typeof pesel === 'object') {
                pesel = pesel.join('');
            }
            return 10 - (this.calculateNumsSumTimesWeights(pesel, false) % 10) % 10;
        };
        Pesel.prototype.validate = function (pesel) {
            if (pesel.length !== this.requiredLength) {
                console.error('wrong length of pesel!');
                return false;
            }
            else {
                var checkSum = (10 - (this.calculateNumsSumTimesWeights(pesel, true) % 10)) % 10;
                return Number(checkSum) === Number(pesel.split('')[pesel.length - 1]);
            }
        };
        return Pesel;
    }(Generator));
    ;
    var Nip = /** @class */ (function (_super) {
        __extends(Nip, _super);
        function Nip() {
            var _this = _super.call(this) || this;
            _this.weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
            _this.requiredLength = 10;
            return _this;
        }
        Nip.prototype.generate = function () {
            var state = false;
            var generatedNip = [];
            var checkSum;
            while (state === false) {
                if (state === false) {
                    for (var i = 0; i < this.requiredLength - 1; i++) {
                        generatedNip.push(Util.getRandomInt(0, 9));
                    }
                    checkSum = this.calculateCheckSum(generatedNip);
                    if (checkSum === 10) {
                        generatedNip = [];
                        state = false;
                    }
                    else {
                        state = true;
                    }
                }
            }
            generatedNip.push(checkSum);
            return generatedNip.join('');
        };
        Nip.prototype.calculateCheckSum = function (nip) {
            if (typeof nip === 'object') {
                nip = nip.join('');
            }
            var checkSum = (this.calculateNumsSumTimesWeights(nip) % 11);
            return checkSum;
        };
        Nip.prototype.validate = function (nip) {
            console.info("NIP: " + nip + " ");
            if (nip.length !== this.requiredLength) {
                console.error("Wrong length of nip: " + nip + " ");
                return false;
            }
            else {
                var checkSum = (this.calculateNumsSumTimesWeights(nip, true) % 11);
                return Number(checkSum) === Number(nip.split('')[nip.length - 1]);
            }
        };
        return Nip;
    }(Generator));
    function generate() {
        if (!config.debugOn) {
            console.info = function () { };
        }
        var pesel = new Pesel(config.pesel.birthYear, config.pesel.birthMonth, config.pesel.birthDay);
        console.log("pesel: " + pesel.generate() + " ");
        var nip1 = new Nip();
        console.log("nip: " + nip1.generate() + " ");
        var regon = new Regon();
        console.log("regon: " + regon.generate() + " ");
        var id = new IDNumber();
        console.log("idNumber: " + id.generate());
        var iban = new Iban();
        console.log("Iban: " + iban.generate());
    }
    // generate();
    function testAll() {
        var pesel1 = new Pesel('1928', '07', '11');
        var pesel1Value = pesel1.generate();
        console.assert(pesel1.validate(pesel1Value) === true, Util.getErrorInfo('pesel') + pesel1Value);
        var pesel2 = new Pesel('1928', '07', '12');
        var pesel2Value = pesel2.generate();
        console.assert(pesel2.validate(pesel2Value) === true, Util.getErrorInfo('pesel') + pesel1Value);
        var nip1 = new Nip();
        var nip1Value = nip1.generate();
        console.assert(nip1.validate(nip1Value) === true, Util.getErrorInfo('nip') + nip1Value);
        var nip2 = new Nip();
        var nip2Value = nip2.generate();
        console.assert(nip2.validate(nip2Value) === true, Util.getErrorInfo('nip') + nip2Value);
        var idNumber1 = new IDNumber();
        var idNumberValue = idNumber1.generate();
        console.assert(idNumber1.validate(idNumberValue) === true, Util.getErrorInfo('ID NUMBER') + idNumberValue);
        var reg1 = new Regon();
        var regonValue = reg1.generate();
        console.assert(reg1.validate(regonValue) === true, Util.getErrorInfo('REGON') + regonValue);
        // const iban1 = new Iban();
        // // console.assert(iban1.validate('PL83101010230000261395100000') === true, Util.getErrorInfo(iban1) + iban1);
        // console.assert(iban1.validate(iban1.generate()) === true, 'Iban is not ok');
        var iban2 = new Iban2();
        console.log(iban2.validate(10301944));
        console.log(iban2.validate(11602202));
        console.assert(iban2.validate(iban2.generate()) === true, 'error');
    }
    testAll();
})();
