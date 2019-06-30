(() => {
    const config = {
        pesel: {
            birthDay: '31', // ex 20, without leading 0
            birthMonth: '06', // ex 12, without leading 0
            birthYear: '', // ex 1988
            sex: 'M', // M or F
        },
    };

    class Generator {
        getRandomInt(min, max) {
            const generatedNum = Math.floor(
                Math.random() * (max - min + 1)
            ) + min;
            return generatedNum;
        }

        getRandom() {
            const rand = this.getRandomInt(0, this.exampleValues.length - 1);
            return rand;
        };

        get getGenerated() {
            return `${this.name} : ${this.exampleValues[this.getRandom()]}`;
        }
    }

    class Regon extends Generator {
        constructor() {
            super();
            this.name = 'REGON';
            this.exampleValues = [1, 2, 3];
        }
    }

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
            generatedPesel.push(this.setMonth(this.month));
            generatedPesel.push(this.setDay(this.day));

            for (let i = 0; i < 3; i++) {
                generatedPesel.push(this.getRandomInt(0, 9));
            }

            generatedPesel.push(this.setSex());
            generatedPesel.push(
                this.calculateCheckSum(generatedPesel.join(''))
            );
            return generatedPesel.join('');
        }

        setDay(givenDay) {
            let day;
            const birthDay = givenDay;

            if (!birthDay) {
                console.warn('Missing value: config.pesel.birthDay');
                console.log(`Generating random value for config.pesel.birthDay`);
                day = this.generateRandomDay();
            } else if (Number(birthDay) > 31) {
                console.error(`Wrong day value ${birthDay}`);
                day = this.generateRandomDay();
            } else if (Number(birthDay) >= 30 && config.pesel.birthMonth === '2') {
                console.warn(`Wrong days value for february!: ${birthDay}`);
                console.log(`Generating random value for config.pesel.birthDay`);
                day = this.generateRandomDay();
            } else if (Number(birthDay) >= 31 && config.pesel.birthMonth === '4' ||
                Number(birthDay) >= 31 && config.pesel.birthMonth === '6' ||
                Number(birthDay) >= 31 && config.pesel.birthMonth === '9' ||
                Number(birthDay) >= 31 && config.pesel.birthMonth === '11'
            ) {
                console.warn(`Wrong days value for ${this.months[Number(config.pesel.birthMonth) - 1]}`);
                day = this.generateRandomDay();
                console.log(`Generating random value for config.pesel.birthDay ${birthDay}`);
            } else if (config.pesel.birthDay.length === 1) {
                day = `0${config.pesel.birthDay}`;
            } else if (config.pesel.birthDay.length === 2) {
                day = `${config.pesel.birthDay}`;
            }
            return day;
        }

        setMonth(givenMonth) {
            console.log(`${givenMonth} gm`);

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
            const rand = this.getRandomInt(1, 12);
            if (String(rand).length === 1) {
                return `0${rand}`;
            } else {
                return String(rand);
            }
        }

        generateRandomDay() {
            const rand = this.getRandomInt(1, 31);
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
                sex = this.getRandomTableItem(nums);
            } else if (config.pesel.sex === 'F') {
                sex = this.getRandomTableItem(this.femaleNums);
            } else if (config.pesel.sex === 'M') {
                sex = this.getRandomTableItem(this.maleNums);
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
            const randomYear = this.getRandomInt(1940, 2019);
            console.log(randomYear);
            return randomYear;
        }

        getRandomTableItem(nums) {
            return nums[this.getRandomInt(0, nums.length - 1)];
        }

        calculateCheckSum(pesel) {
            const numsSumTimesWeights = String(pesel).split('')
                .map((value, index) => Number(value) * this.weights[index])
                .reduce((a, b) => a + b, 0);
            const checkSum = (10 - (numsSumTimesWeights % 10)) % 10;
            return checkSum;
        }

        validatePesel(pesel) {
            if (pesel.length !== 11) {
                console.error('wrong length of pesel!');
                return 'Wrong length';
            } else {
                const numsSumTimesWeights = String(pesel)
                    .split('').slice(0, 10)
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
        }
        generate() {
            const generatedNip = [];

            for (let i = 0; i < 9; i++) {
                generatedNip.push(this.getRandomInt(0, 9));
            }

            generatedNip.push(
                this.calculateCheckSum(generatedNip.join(''))
            );
            return generatedNip.join('');
        }

        calculateCheckSum(nip) {
            console.log(`nip: ${nip}`);

            const numsSumTimesWeights = String(nip).split('')
                .map((value, index) => Number(value) * this.weights[index])
                .reduce((a, b) => a + b, 0);
            console.log(`numsSumTimesWeights ${numsSumTimesWeights}`);

            const checkSum = (numsSumTimesWeights % 11);
            return checkSum;
        }
    }

    function generate() {
        const pesel = new Pesel('2018', '02', '02');
        console.log(`pesel: ${pesel.generate()}`);

        const nip1 = new Nip();
        console.log(`nip: ${nip1.generate()}`);

        // iban = new Iban();
        // console.log(iban.getGenerated);

        // regon = new Regon();
        // console.log(regon.getGenerated);
    }
    generate();


    function testPesel() {
        const pesel1 = new Pesel('1928', '07', '12');
        const newPesel = pesel1.generate();
        console.assert(pesel1.validatePesel(newPesel) === true);

        const pesel2 = new Pesel('1928', '07', '12');
        const newPesel2 = pesel2.generate();
        console.assert(pesel2.validatePesel(newPesel2) === true);
    }

    testPesel();
})();
