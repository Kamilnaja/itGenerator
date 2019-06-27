(() => {
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    class Generator {
        constructor(values) {
            this.exampleValues = values;
        }
        generate() {
            const rand = getRandomInt(0, this.exampleValues.length);
            console.log(this.exampleValues[rand]);
        };
    }

    class Regon {
        constructor() {
            this.exampleValues = [];
        }

        generate() {

        }
    }

    class Iban {
        constructor() {
            this.exampleValues = [33937010598015424872480179, 56124047643090906395648234, 80917700086215672742767919, 54910110425937909896107589];
        }
        generate() {

        }
    }

    class Pesel extends Generator {
        super(){ }
        
        constructor() {
            this.exampleValues = [
                23022303829, 18321028870, 16320716352, 92051015519
            ];
        }
        generate() {
            const rand = getRandomInt(0, this.exampleValues.length);
            console.log(this.exampleValues[rand]);
        };
    };

    class Nip {

    }

    function generate() {
        console.log('generated values');
        regon = new Regon();
        regon.generate();

        pesel = new Pesel();
        pesel.generate();

        iban = new Iban();
        console.log(`iban : ${iban.generate()};`);
        
        
    }

    generate();
})();