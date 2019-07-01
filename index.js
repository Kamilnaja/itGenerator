(() => {
    const config = {
        pesel: {
            birthDay: '20', // ex 20, without leading 0
            birthMonth: '06', // ex 12, without leading 0
            birthYear: '1988', // ex 1988
            sex: 'M', // M or F
        },
    };

    class Util {
        static getRandomInt(min, max) {
            const generatedNum = Math.floor(
                Math.random() * (max - min + 1)
            ) + min;
            return generatedNum;
        }

        static getRandomTableItem(array) {
            return array[Util.getRandomInt(0, array.length - 1)];
        }
    }

    class Generator {
        constructor() {
            this.requiredLength = 0;
            this.weights = [];
        };

        calculateCheckSum() {
            throw new Error('Please implement me!');
        };

        validate() {
            throw new Error('Please implement me!');
        };

        generate() {
            console.log('validating');
        }
    }

    class Regon extends Generator {
        constructor() {
            super();
            this.name = 'REGON';
            this.weights = [8, 9, 2, 3, 4, 5, 6, 7];
            this.requiredLength = 9;
        }

        generate() {
            const generatedRegon = [];

            for (let i = 0; i < this.requiredLength - 1; i++) {
                generatedRegon.push(Util.getRandomInt(0, 9));
            }

            const checkSum = this.calculateCheckSum(generatedRegon.join(''));
            generatedRegon.push(checkSum === 10 ? 0 : checkSum);
            return generatedRegon.join('');
        }

        calculateCheckSum(regon) {
            const numsSumTimesWeights = String(regon)
                .split('')
                .map((value, index) => Number(value) * this.weights[index])
                .reduce((a, b) => a + b, 0);

            const checkSum = (numsSumTimesWeights % 11);
            return checkSum;
        };

        validate(regon) {
            if (regon.length !== this.requiredLength) {
                console.error(`Wrong ${this.name} length: ${regon}`);
                return `Wrong ${this.name} length`;
            } else {
                const numsSumTimesWeights = String(regon)
                    .split('').slice(0, this.requiredLength - 1)
                    .map((value, index) => Number(value) * this.weights[index])
                    .reduce((a, b) => a + b, 0);
                const checkSum = (numsSumTimesWeights % 11);
                return Number(checkSum) === Number(regon.split('')[regon.length - 1]);
            }
        };
    }

    // eslint-disable-next-line no-unused-vars
    class Iban extends Generator {
        constructor() {
            super();
            this.exampleValues = [
                '33937010598015424872480179',
                '56124047643090906395648234',
                '80917700086215672742767919',
                '54910110425937909896107589'];
            this.name = 'IBAN';
        }
    }

    class Pesel extends Generator {
        constructor(year, month, day) {
            super();
            this.name = 'PESEL';
            this.requiredLength = 11;
            this.weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
            this.femaleNums = [0, 2, 4, 6, 8];
            this.maleNums = [1, 3, 5, 7, 9];
            this.months = [
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
            this.year = year;
            this.month = month;
            this.day = day;
        }

        generate() {
            const generatedPesel = [];
            generatedPesel.push(this.setYear(this.year));

            const tempMonth = this.setMonth(this.month);
            generatedPesel.push(tempMonth);

            const tempDay = this.setDay(this.day, tempMonth);
            generatedPesel.push(tempDay);

            for (let i = 0; i < 3; i++) {
                generatedPesel.push(Util.getRandomInt(0, 9));
            }

            generatedPesel.push(this.setSex());
            generatedPesel.push(
                this.calculateCheckSum(generatedPesel.join(''))
            );
            return generatedPesel.join('');
        }

        setDay(givenDay, month) {
            console.log('month setDay', month);

            let day;
            const birthDay = givenDay;

            if (!birthDay) {
                console.warn('Missing value: config.pesel.birthDay');
                console.log(`Generating random value for config.pesel.birthDay`);
                day = this.generateRandomDay(month);
            } else if (Number(birthDay) > 31) {
                console.error(`Wrong day value ${birthDay}`);
                day = this.generateRandomDay(month);
            } else if (Number(birthDay) >= 30 && config.pesel.birthMonth === '2') {
                console.warn(`Wrong days value for february!: ${birthDay}`);
                console.log(`Generating random value for config.pesel.birthDay`);
                day = this.generateRandomDay(month);
            } else if (Number(birthDay) >= 31 && config.pesel.birthMonth === '4' ||
                Number(birthDay) >= 31 && config.pesel.birthMonth === '6' ||
                Number(birthDay) >= 31 && config.pesel.birthMonth === '9' ||
                Number(birthDay) >= 31 && config.pesel.birthMonth === '11'
            ) {
                console.warn(`Wrong days value for ${this.months[Number(config.pesel.birthMonth) - 1]}`);
                day = this.generateRandomDay(month);
                console.log(`Generating random value for config.pesel.birthDay ${birthDay}`);
            } else if (config.pesel.birthDay.length === 1) {
                day = `0${config.pesel.birthDay}`;
            } else if (config.pesel.birthDay.length === 2) {
                day = `${config.pesel.birthDay}`;
            }
            return day;
        }

        setMonth(givenMonth) {
            let month;
            if (Number(givenMonth) > 12 || !givenMonth) {
                console.log(`Wrong month value : ${config.pesel.birthMonth}`);
                month = this.generateRandomMonth();
            } else if (config.pesel.birthMonth <= 12) {
                month = this.calculatePeselMonth(givenMonth);
            }
            return month;
        }

        calculatePeselMonth(month) {
            const year = Number(config.pesel.birthYear); // not always
            if (Number(config.pesel.birthMonth) > 12) {
                console.log('Wrong month value, generate my own');
                month = this.generateRandomMonth();
            } else if (year >= 1800 && year <= 1899) {
                month = Number(config.pesel.birthMonth) + 80;
            } else if (year >= 1900 && year <= 1990) {
                month = config.pesel.birthMonth;
            } else if (year >= 2000 && year <= 2099) {
                month = Number(config.pesel.birthMonth) + 20;
            } else if (year >= 2100 && year <= 2199) {
                month = Number(config.pesel.birthMonth) + 40;
            } else if (year >= 2200 && year <= 2299) {
                month = Number(config.pesel.birthMonth) + 60;
            }
            return month;
        }

        generateRandomMonth() {
            const rand = Util.getRandomInt(1, 12);
            if (String(rand).length === 1) {
                return `0${rand}`;
            } else {
                return String(rand);
            }
        }

        generateRandomDay(month) {
            console.log(`GRD ${month}`);
            let lastDayOfMonth = 31;

            const thirtyOneDaysMonths = [1, 3, 5, 7, 8, 10, 12];
            const thirtyDaysMonths = [4, 6, 9, 11];
            console.log(`${Number(month)}`);

            if (thirtyOneDaysMonths.some((item) => item === Number(month))) {
                lastDayOfMonth = 31;
            } else if (thirtyDaysMonths.some((item) => item === Number(month))) {
                lastDayOfMonth = 30;
                console.log('Thirty');
            } else if (Number(month) === 2) {
                console.log('Is february');
                lastDayOfMonth = 29;
            } else {
                console.error(`Wrong month value!`);
            }

            const rand = Util.getRandomInt(1, lastDayOfMonth);
            if (String(rand).length === 1) {
                return `0${rand}`;
            } else {
                return String(rand);
            }
        }

        setSex() {
            let sex;
            if (!config.pesel.sex) {
                console.log(
                    `No pesel sex value or wrong value: ${config.pesel.sex}. Generate my own`
                );
                const nums = [...this.femaleNums, ...this.maleNums].sort();
                sex = Util.getRandomTableItem(nums);
            } else if (config.pesel.sex === 'F') {
                sex = Util.getRandomTableItem(this.femaleNums);
            } else if (config.pesel.sex === 'M') {
                sex = Util.getRandomTableItem(this.maleNums);
            }
            return sex;
        }

        setYear(givenYear) {
            let year;
            if (!givenYear) {
                console.log(`No year value. Generate my own`);
                year = String(this.generateRandomYear()).slice(2, 4);
            } else if (String(givenYear).length === 4) {
                year = String(givenYear).slice(2, 4);
            }
            return year;
        };

        // generate year from 1940 to 2019
        generateRandomYear() {
            const randomYear = Util.getRandomInt(1940, 2019);
            console.log(randomYear);
            return randomYear;
        }

        calculateCheckSum(pesel) {
            const numsSumTimesWeights = String(pesel).split('')
                .map((value, index) => Number(value) * this.weights[index])
                .reduce((a, b) => a + b, 0);
            const checkSum = (10 - (numsSumTimesWeights % 10)) % 10;
            return checkSum;
        }

        validate(pesel) {
            if (pesel.length !== this.requiredLength) {
                console.error('wrong length of pesel!');
                return 'Wrong length';
            } else {
                const numsSumTimesWeights = String(pesel)
                    .split('').slice(0, this.requiredLength - 1)
                    .map((value, index) => Number(value) * this.weights[index])
                    .reduce((a, b) => a + b, 0);
                const checkSum = (10 - (numsSumTimesWeights % 10)) % 10;
                return Number(checkSum) === Number(pesel.split('')[pesel.length - 1]);
            }
        }
    };

    class Nip extends Generator {
        constructor() {
            super();
            this.weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
            this.requiredLength = 10;
        }

        generate() {
            let state = false;
            let generatedNip = [];
            let checkSum;

            while (state === false) {
                if (state === false) {
                    for (let i = 0; i < this.requiredLength - 1; i++) {
                        generatedNip.push(Util.getRandomInt(0, 9));
                    }
                    checkSum = this.calculateCheckSum(generatedNip.join(''));
                    if (checkSum === 10) {
                        console.log('10, re generation');
                        generatedNip = [];
                        state = false;
                    } else {
                        state = true;
                    }
                }
            }

            generatedNip.push(checkSum);
            return generatedNip.join('');
        }

        calculateCheckSum(nip) {
            const numsSumTimesWeights = String(nip)
                .split('')
                .map((value, index) => Number(value) * this.weights[index])
                .reduce((a, b) => a + b, 0);

            const checkSum = (numsSumTimesWeights % 11);
            return checkSum;
        }

        validate(nip) {
            if (nip.length !== this.requiredLength) {
                console.error(`Wrong length of nip: ${nip}`);
                return 'Wrong length';
            } else {
                const numsSumTimesWeights = String(nip)
                    .split('').slice(0, this.requiredLength - 1)
                    .map((value, index) => Number(value) * this.weights[index])
                    .reduce((a, b) => a + b, 0);
                const checkSum = (numsSumTimesWeights % 11);
                return Number(checkSum) === Number(nip.split('')[nip.length - 1])
            }
        }
    }

    function generate() {
        const pesel = new Pesel(config.pesel.birthYear, config.pesel.birthMonth, config.pesel.birthDay);
        console.log(`pesel: ${pesel.generate()}`);

        const nip1 = new Nip();
        console.log(`nip: ${nip1.generate()}`);

        regon = new Regon();
        console.log(`regon: ${regon.generate()}`);
    }

    generate();

    function testAll() {
        // const pesel1 = new Pesel('1928', '07', '');
        // console.assert(pesel1.validate(pesel1.generate()) === true, 'Pesel is not ok');

        // const pesel2 = new Pesel('1928', '07', '12');
        // console.assert(pesel2.validate(pesel2.generate()) === true, 'Pesel is not ok');

        // const nip1 = new Nip();
        // console.assert(nip1.validate(nip1.generate()) === true, 'Nip is not ok');

        // const nip2 = new Nip();
        // console.assert(nip2.validate(nip2.generate()) === true, 'Nip is not ok');

        // const reg1 = new Regon();
        // console.assert(reg1.validate(reg1.generate()) === true, 'Regon is not ok');
    }

    testAll();
})();
