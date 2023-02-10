import * as fs from "fs";
import * as papa from "papaparse";
import * as path from "path";

import { H5pPackage } from "./h5p-package";

import { FindTheWordsCreator } from "./findthewords-creator";
import { FlashcardsCreator } from './flashcards-creator';
import { DialogCardsCreator } from "./dialogcards-creator";


async function runDialogcards(
   { csvfile, outputfile, title, encoding, delimiter, language, mode, description }: { csvfile: string; outputfile: string; title: string; encoding: BufferEncoding; delimiter: string; language: string; mode: "repetition" | "normal"; description: string; }): Promise<void> {
   try {
      console.log("Creating module content type.");
      csvfile = csvfile.trim();
      outputfile = outputfile.trim();

      let csv = fs.readFileSync(csvfile, { encoding });
      let csvParsed = papa.parse(csv, {
         header: true,
         delimiter,
         skipEmptyLines: true,
      });
      let h5pPackage = await H5pPackage.createFromHub(
         "H5P.DialogCards",
         language
      );
      let creator = new DialogCardsCreator(
         h5pPackage,
         csvParsed.data as any,
         mode,
         description,
         path.dirname(csvfile),
      );
      await creator.create();
      creator.setTitle(title);
      creator.savePackage(outputfile);
   } catch (error) {
      console.log(error)
   }

};


async function runFindTheWords(
   { csvfile, outputfile, title, encoding, delimiter, language, description }: { csvfile: string; outputfile: string; title: string; encoding: BufferEncoding; delimiter: string; language: string; description: string; }): Promise<void> {
   try {
      console.log("Creating module content type.");
      csvfile = csvfile.trim();
      outputfile = outputfile.trim();

      let csv = fs.readFileSync(csvfile, { encoding });
      let csvParsed = papa.parse(csv, {
         header: true,
         delimiter,
         skipEmptyLines: true,
      });
      let h5pPackage = await H5pPackage.createFromHub(
         "H5P.FindTheWords",
         language
      );
      let findthewordscreator = new FindTheWordsCreator(
         h5pPackage,
         csvParsed.data as any,
         description,
         title,
         path.dirname(csvfile)
      );
      await findthewordscreator.create();
      findthewordscreator.savePackage(outputfile);
   } catch (error) {
      console.log(error)
   }

};

async function runFlashcards(
   { csvfile, outputfile, title, encoding, delimiter, language, description }: { csvfile: string; outputfile: string; title: string; encoding: BufferEncoding; delimiter: string; language: string; description: string; }): Promise<void> {
   try {
      console.log("Creating flashcards content type.");
      csvfile = csvfile.trim();
      outputfile = outputfile.trim();

      let csv = fs.readFileSync(csvfile, encoding);
      let csvParsed = papa.parse(csv, {
         header: true,
         delimiter,
         skipEmptyLines: true,
      });
      let h5pPackage = await H5pPackage.createFromHub("H5P.Flashcards", language);
      let flashcardsCreator = new FlashcardsCreator(
         h5pPackage,
         csvParsed.data as any,
         description,
         title,
         path.dirname(csvfile)
      );
      await flashcardsCreator.create();
      flashcardsCreator.savePackage(outputfile);
   } catch (error) {
      console.log(error)
   }

}

export { runFindTheWords, runDialogcards, runFlashcards };