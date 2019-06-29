(() => {
    const config = {
        pesel: {
            birthDay: '03', // ex 20
            birthMonth: '03', // ex 12
            birthYear: '2003', // ex 1988
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
        constructor() {
            super();
            this.exampleValues = [
                '23022303829', '01251220809',
            ];
            this.name = 'PESEL';
            this.generatedPesel = [];
            this.sexNumber = '';
        }

        generateCustomPesel() {
            this.generatedPesel.push(this.setYear());
            this.generatedPesel.push(this.setMonth());
            this.generatedPesel.push(this.setDay());

            for (let i = 0; i < 3; i++) {
                this.generatedPesel.push(this.getRandomInt(0, 9));
            }

            this.generatedPesel.push(this.setSex());
            this.generatedPesel.push(
                this.calculateCheckSum(this.generatedPesel.join(''))
            );
            return this.generatedPesel.join('');
        }

        setDay() {
            let day;
            if (config.pesel.birthDay) {
                if (Number(config.pesel.birthDay) > 31) {
                    console.log(`Wrong day value ${config.pesel.birthDay}`);
                    day = this.generateRandomDay();
                } else if (config.pesel.birthDay.length === 1) {
                    day = `0${config.pesel.birthDay}`;
                } else if (config.pesel.birthDay.length === 2) {
                    day = `${config.pesel.birthDay}`;
                }
            } else {
                console.log('No day value, generate my own');
                day = this.generateRandomDay();
            }
            return day;
        }

        setMonth() {
            let month;
            if (config.pesel.birthMonth) {
                month = this.calculatePeselMonth(month);
            } else {
                console.log('No month value, generate my own');
                month = this.generateRandomMonth();
            }
            return month;
        }

        calculatePeselMonth(month) {
            const year = Number(config.pesel.birthYear);
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
            const femaleNums = [0, 2, 4, 6, 8];
            const maleNums = [1, 3, 5, 7, 9];
            if (config.pesel.sex === 'F') {
                sex = this.getRandomTableItem(femaleNums);
            } else if (config.pesel.sex === 'M') {
                sex = this.getRandomTableItem(maleNums);
            } else {
                console.log(
                    `No pesel sex value or wrong value: ${config.pesel.sex}. 
                    Generate my own`
                );
                const nums = [...femaleNums, ...maleNums].sort();
                sex = this.getRandomTableItem(nums);
            }
            return sex;
        }

        setYear() {
            let year;
            if (config.pesel.birthYear) {
                if (String(config.pesel.birthYear).length === 4) {
                    year = String(config.pesel.birthYear).slice(2, 4);
                }
            } else {
                console.log('bad year value!');
            }
            return year;
        }

        getRandomTableItem(nums) {
            return nums[this.getRandomInt(0, nums.length - 1)];
        }

        calculateCheckSum(pesel) {
            const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
            const numsSumTimesWeights = String(pesel).split('')
                .map((value, index) => Number(value) * weights[index])
                .reduce((a, b) => a + b, 0);
            const checkSum = (10 - (numsSumTimesWeights % 10)) % 10;
            return checkSum;
        }
    };

    class Nip {

    }

    function generate() {
        pesel = new Pesel();
        console.log(`pesel: ${pesel.generateCustomPesel()}`);

        // iban = new Iban();
        // console.log(iban.getGenerated);

        // regon = new Regon();
        // console.log(regon.getGenerated);
    }

    generate();
})();
