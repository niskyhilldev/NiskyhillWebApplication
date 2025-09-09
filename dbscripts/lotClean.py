import re
import argparse
import pandas as pd

# Last lot token: digits with an optional trailing letter (e.g., 46, 46a, 12B)
# We still pick the *last* such token in the string.
LAST_LOT_TOKEN_RE = re.compile(r'(\d+[A-Za-z]?)(?!.*\d)')

def split_details_and_lot(text: str):
    """Return (details_left, lot_number)."""
    if text is None:
        return "", ""

    s = str(text).strip()
    if not s:
        return "", ""

    m = LAST_LOT_TOKEN_RE.search(s)
    if not m:
        # no lot-like token found
        return clean_left_text(s), ""

    lot_num = m.group(1)
    start, end = m.start(), m.end()

    # remove the lot token
    before = s[:start]
    after  = s[end:]

    # if right before the token there is '#', drop it (and any surrounding space)
    before = re.sub(r'\s*#\s*$', '', before)

    # join remaining parts (usually 'after' is empty)
    left_raw = (before + after)

    # clean left side (remove stray '#'/'$' etc.)
    details_left = clean_left_text(left_raw)

    return details_left, lot_num

def clean_left_text(s: str) -> str:
    """Remove stray '#' and '$', tidy whitespace/edge punctuation."""
    s = s.replace('#', '').replace('$', '')
    s = re.sub(r'\s+', ' ', s).strip()
    s = re.sub(r'^[,.;:-]+', '', s)
    s = re.sub(r'[,.;:-]+$', '', s)
    return s

def process_excel(input_path: str, output_path: str = None, sheet=0, col_name="Lot", drop_original=False):
    # If no output is given, overwrite the original file in place
    if output_path is None:
        output_path = input_path

    df = pd.read_excel(input_path, sheet_name=sheet)

    if col_name not in df.columns:
        raise ValueError(f"Column '{col_name}' not found. Columns: {list(df.columns)}")

    # Compute the split
    results = df[col_name].apply(split_details_and_lot)
    details_col = results.str[0]
    number_col  = results.str[1].astype("string")

    # Insert the two new columns immediately after the original Lot column
    insert_at = df.columns.get_loc(col_name) + 1
    df.insert(insert_at, "Lot_Details", details_col)
    df.insert(insert_at + 1, "Lot_Number", number_col)

    # Optionally drop the original Lot column
    if drop_original:
        df.drop(columns=[col_name], inplace=True)

    # Overwrite (or write) the file
    df.to_excel(output_path, index=False)

def main():
    ap = argparse.ArgumentParser(description="Split 'Lot' into Lot_Details and Lot_Number (in-place by default).")
    ap.add_argument("input", help="Path to input Excel (e.g., input.xlsx)")
    ap.add_argument("-o", "--output", default=None, help="Optional output Excel path (default: overwrite input)")
    ap.add_argument("-s", "--sheet", default=0, help="Sheet name or index (default: 0)")
    ap.add_argument("-c", "--column", default="Lot", help="Column name to split (default: 'Lot')")
    ap.add_argument("--drop-original", action="store_true",
                    help="Drop the original 'Lot' column after splitting")
    args = ap.parse_args()

    process_excel(
        input_path=args.input,
        output_path=args.output,
        sheet=args.sheet,
        col_name=args.column,
        drop_original=args.drop_original
    )
    print(f"Done. Wrote: {args.output or args.input}")

if __name__ == "__main__":
    main()
