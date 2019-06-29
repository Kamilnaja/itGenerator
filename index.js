(() => {
    config = {
        pesel: {
            birthDay: '',
            birthMonth: '12',
            birthYear: '08',
            sex: 'G'
        }
    }

    class Generator {
        getRandomInt(min, max) {
            const generatedNum = Math.floor(Math.random() * (max - min + 1)) + min;
            return generatedNum;
        }

        getRandom() {
            const rand = this.getRandomInt(0, this.exampleValues.length - 1);
            return rand;
        };

        get getGenerated() {
            return `${this.name} : ${this.exampleValues[this.getRandom()]}`
        }
    }

    class Regon extends Generator {
        constructor() {
            super()
            this.name = "REGON"
            this.exampleValues = [1, 2, 3];
        }
    }

    class Iban extends Generator {
        constructor() {
            super();
            this.exampleValues = ['33937010598015424872480179', '56124047643090906395648234', '80917700086215672742767919', '54910110425937909896107589'];
            this.name = "IBAN"
        }
    }

    class Pesel extends Generator {
        constructor() {
            super();
            this.exampleValues = [
                '23022303829', '01251220809'
            ];
            this.name = "PESEL"
            this.generatedPesel = [];
            this.sexNumber = '';
        }

        generateCustomPesel() {
            console.log(config.pesel.sex);

            this.generatedPesel[0] = this.setYear();
            this.generatedPesel[1] = this.setMonth();
            this.generatedPesel[2] = this.setDay();
            this.generatedPesel[3] = this.setSex();
            console.log(this.generatedPesel);

            return this.generatedPesel.join('')
        }

        setDay() {
            let day;
            if (config.pesel.birthDay) {
                if (Number(config.pesel.birthDay) > 31) {
                    console.log(`Wrong day value ${config.pesel.birthDay}`);
                    day = this.generateRandomDay();
                } else if (config.pesel.birthDay.length === 1) {
                    day = `0${config.pesel.birthDay}`
                } else if (config.pesel.birthDay.length === 2) {
                    day = `${config.pesel.birthDay}`
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
                if (Number(config.pesel.birthMonth) > 12) {
                    console.log('Wrong month value, generate my own');
                    month = this.generateRandomMonth();
                } else if (config.pesel.birthMonth.length === 1) {
                    month = `0${config.pesel.birthMonth}`;
                } else if (config.pesel.birthMonth.length === 2) {
                    month = `${config.pesel.birthMonth}`
                }
            } else {
                console.log('No month value, generate my own')
                month = this.generateRandomMonth();
            }
            return month;
        }

        generateRandomMonth() {
            const rand = this.getRandomInt(1, 12);
            if (String(rand).length === 1) {
                return `0${rand}`
            } else {
                return String(rand);
            }
        }

        generateRandomDay() {
            const rand = this.getRandomInt(1, 31);
            if (String(rand).length === 1) {
                return `0${rand}`
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
            }
            else if (config.pesel.sex === 'M') {
                sex = this.getRandomTableItem(maleNums);
            }
            else {
                console.log(`No pesel sex value or wrong value: ${config.pesel.sex}. Generate my own`);
                const nums = [...femaleNums, ...maleNums].sort();
                sex = this.getRandomTableItem(nums);
            }
            return sex;
        }

        setYear() {
            let year = '88'
            if (config.pesel.birthYear) {
                console.log(`by : ${config.pesel.birthYear}`);
                if (String(config.pesel.birthYear).length === 4) {
                    year = String(config.pesel.birthYear).slice(2, 4);
                }
                else if (String(config.pesel.birthYear).length === 2) {
                    year = String(config.pesel.birthYear);
                }
            }
            return year;
        }

        getRandomTableItem(nums) {
            return nums[this.getRandomInt(0, nums.length - 1)];
        }

        validatePesel() {

        }
    };

    class Nip {

    }

    function generate() {
        pesel = new Pesel();
        // console.log(pesel.getGenerated);
        console.log(pesel.generateCustomPesel());


        // iban = new Iban();
        // console.log(iban.getGenerated);

        // regon = new Regon();
        // console.log(regon.getGenerated);
    }

    generate();
})();