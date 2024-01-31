import { SelfProof, Field, ZkProgram, verify, Proof, Provable } from 'o1js';

let BigProgram = ZkProgram({
  name: 'example-with-input',
  publicInput: Field,

  methods: {
    baseCase: {
      privateInputs: [],
      method(input: Field) {
        input.assertEquals(Field(0));
      },
    },

    inductiveCase: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },

    inductiveCase1: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },

    inductiveCase2: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },

    inductiveCase3: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },

    inductiveCase4: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },

    inductiveCase5: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },

    inductiveCase6: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },

    inductiveCase7: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },

    inductiveCase8: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },

    inductiveCase9: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },

    inductiveCase10: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },

    inductiveCase11: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },

    inductiveCase12: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },

    inductiveCase13: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },

    inductiveCase14: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },

    inductiveCase15: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },

    inductiveCase16: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },

    inductiveCase17: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },

    inductiveCase18: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },
  },
});

let BigProof = ZkProgram.Proof(BigProgram);

console.log('program digest', BigProgram.digest());

console.log('compiling MyProgram...');
let { verificationKey } = await BigProgram.compile();
console.log('verification key', verificationKey.data.slice(0, 10) + '..');

console.log('proving base case...');
let proof = await BigProgram.baseCase(Field(0));

// type sanity check
proof satisfies Proof<Field, void>;

console.log('verify...');
let ok = await verify(proof.toJSON(), verificationKey);
console.log('ok?', ok);

console.log('verify alternative...');
ok = await BigProgram.verify(proof);
console.log('ok (alternative)?', ok);

const N = 1000;

console.log('starting proof loop...');
for (let i = 1; i < N; i++) {
  console.log('proof run #', i);
  const newProof = await BigProgram.inductiveCase(Field(i), proof);
  let json_proof = newProof.toJSON();
  let from_json_proof = BigProof.fromJSON(json_proof);
  ok = await verify(from_json_proof, verificationKey);
  proof = newProof;
}
