(() => {


    class Generator {
        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        getRandom() {
            const rand = this.getRandomInt(0, this.exampleValues.length);
            return this.getRandomInt(0, this.exampleValues.length);
        };

        getGenerated() {
            return `${this.name} : ${this.exampleValues[this.getRandom()]} gen : ${this.getRandom()}`
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
                23022303829
            ];
            this.name = "PESEL"
        }
    };

    class Nip {

    }

    function generate() {
        pesel = new Pesel();
        console.log(pesel.getGenerated());

        // iban = new Iban();
        // console.log(iban.getGenerated());

        // regon = new Regon();
        // console.log(regon.getGenerated());

    }

    generate();
})();