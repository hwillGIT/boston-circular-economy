# Questions for a Technical Decision

Use these questions to test a recommendation. Present the answers in ordinary language.

| Question                                   | Useful evidence                                                   |
| ------------------------------------------ | ----------------------------------------------------------------- |
| What result should a person observe?       | A specific action and visible result                              |
| What supports the choice?                  | Inspected code, a test, a measurement, or an accepted requirement |
| Why does that evidence support the result? | A trace through the rule that produces the result                 |
| What limits the conclusion?                | Tested inputs, missing data, and untested conditions              |
| When would another option be better?       | A fair comparison under a different constraint                    |
| What would change the decision?            | A concrete failure, new requirement, or contrary observation      |

## Example

Changing a clinic filter must clear the previous map area.
The filter handler owns both changes, so the results can include matching clinics outside that area.
The browser check found the outside-area clinic after the filter changed.

Selecting the same filter keeps the current area.
An effect that clears the area after every render would also clear a deliberate area selection.
If filters can change outside these handlers, inspect that caller before relying on this design.

## Help the contributor test their understanding

Ask them to predict the result before running one example.
Ask them to trace the rule from input to output.
Change one condition and ask whether the decision still holds.
Ask them to compare the closest alternative fairly.
Ask them to explain the result without reading an AI answer.

Choose the exercise that addresses the actual gap.
Do not require every exercise for every assignment.
A reviewer checks the explanation against the submitted revision.
