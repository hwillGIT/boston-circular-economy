from etl.local_data_store import LocalDataStore
from etl.merge_processor import MergeProcessor


def main() -> None:
    """Executes the merge processing job using the local data store.

    This function initializes a LocalDataStore and a MergeProcessor,
    reads the input normalized locations, merges them, and writes the
    results back to the local data store.

    Args:
        None.

    Returns:
        None.

    Examples:
        >>> # main()  # executes the merge process
    """
    # reads normalized locations from the local store
    # writes merged locations back to the local store
    store = LocalDataStore()
    processor = MergeProcessor(store)
    processor.process()

    print("merge-process-to-local finished")


if __name__ == "__main__":
    main()
