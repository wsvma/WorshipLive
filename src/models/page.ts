export class Paragraph {

    constructor(
        public region1: string = '',
        public region2: string = '') {}

    getRegion1Lines() {
        return this.region1.split('\n');
    }

    getRegion2Lines() {
        return this.region2.split('\n');
    }
}

export class Page {

    constructor (
        public name: string,
        public content1: string = '',
        public content2: string = '',
        public maxNumLinesPerParagraph: number = -1) {}

    hasRegionTwo() {
        return this.content2 != '';
    }

    getParagraphs() {
        let region1 = this.content1.replace(/\r/g, '').split('\n\n');
        let region2 = this.content2.replace(/\r/g, '').split('\n\n');
        let paragraphs = [];

        for (let i = 0; i < Math.max(region1.length, region2.length); i++) {
            if (this.maxNumLinesPerParagraph == -1)
                paragraphs.push(new Paragraph(region1[i] || '', region2[i] || ''));
            else {
                let lines1 = (region1[i] || '').split('\n');
                let lines2 = (region2[i] || '').split('\n');
                while (lines1.length || lines2.length) {
                    let acc1 = [];
                    let acc2 = [];
                    for (let j = 0; j < this.maxNumLinesPerParagraph; j++) {
                        acc1.push(lines1.shift() || '');
                        acc2.push(lines2.shift() || '');
                    }
                    paragraphs.push(new Paragraph(acc1.join('\n'), acc2.join('\n')));
                }
            }
        }

        return paragraphs;
    }
}