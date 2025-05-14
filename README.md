# semantic-diff

`BrennanColberg/semantic-diff` is a library designed to describe, as accurately and humanly as possible, the difference between two strings. It was initially developed as a core logic engine for [Quotid](https://quotid.app), the world's best app for long-form memorization, where a key feature is the ability to surface to a user what precise mistakes they made when regurgitating a passage.

This ability comes naturally to humans ("oh, you moved X to Y, and said Z instead of W!"), but is surprisingly difficult to algorithmically identify. Even LLMs struggle to intuit which mistakes/differences were made (as of writing in Q2 2025; eventually they will likely solve this with high reliability).

To this goal, the package has five important parts:

1. a system of abstraction to represent semantic diffs appropriately
2. a harness/protocol for semantic diff generation in other programs
3. a test suite that captures many obvious and undebatable mistake patterns
4. a deterministic semantic-diff implementation that tries to meet the tests
5. a LLM prompt/harness for hooking OpenRouter models up as differs

As of writing, the deterministic system still performs better than LLMs— and is obviously much lower-latency and -cost. Eventually, though, to reiterate from above, I expect that LLMs will ultimately "solve" this problem. Since this package is designed with solutions in mind, it supports both, and will (1) make it possible to verify when LLMs get good at this, while also (2) enabling an elegant switchover once that happens.
