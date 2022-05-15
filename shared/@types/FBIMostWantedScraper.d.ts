interface SimpleFugitiveData {
    name: string;
    mugshot: string;
    posterURL: string;
}

interface FullFugitiveData extends SimpleFugitiveData {
    category: string;
    charges: string[];
    pictures: {
        src: string;
        caption: string;
    }[];
    bio:
        | {
              alias: string | undefined;
              dob: string;
              birthplace: string;
              hair: string;
              eyes: string;
              height: string;
              weight: string;
              build: string;
              complexion: string;
              sex: string;
              race: string;
              occupation: string;
              nationality: string;
              markings: string;
          }
        | undefined;
    remarks: string | undefined;
    caution: {
        text: string | undefined;
        warning: string | undefined;
    };
}
