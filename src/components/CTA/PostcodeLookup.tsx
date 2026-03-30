interface Props {
  postcode: string;
  onPostcodeChange: (pc: string) => void;
  error: string | null;
}

export default function PostcodeLookup({ postcode, onPostcodeChange, error }: Props) {
  return (
    <div className="mb-6">
      <label className="block text-sm text-text-muted mb-2" htmlFor="postcode">
        Enter your postcode
      </label>
      <input
        id="postcode"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={4}
        value={postcode}
        onChange={(e) => onPostcodeChange(e.target.value.replace(/\D/g, ''))}
        placeholder="e.g. 4209"
        className="w-full max-w-xs px-4 py-3 bg-bg-card border border-border text-text-primary
          font-mono text-lg placeholder:text-text-muted/50 focus:outline-none focus:border-crisis-red"
      />
      {error && <p className="text-crisis-red text-sm mt-2">{error}</p>}
    </div>
  );
}
