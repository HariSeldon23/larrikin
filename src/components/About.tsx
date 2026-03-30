export default function About() {
  return (
    <section className="px-6 py-12 md:px-12 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-tight mb-6">
          About This Site
        </h2>

        <div className="space-y-4 text-text-muted text-sm leading-relaxed">
          <p>
            Built by <span className="text-text-primary font-semibold">Justin Trollip</span>.
            Software engineer. Gold Coast, QLD.
          </p>
          <p>
            I built this because I got angry at my fuel bill and did the maths.
            Then I built a calculator so everyone else could do the maths too.
          </p>

          <div className="border border-border bg-bg-card p-4 mt-6 space-y-2 text-xs">
            <p>This site is <strong className="text-text-primary">open source</strong>.</p>
            <p>This site is <strong className="text-text-primary">not affiliated with any political party</strong>.</p>
            <p>It stores no personal data.</p>
            <p>It sends no emails — it opens YOUR email app with YOUR numbers.</p>
            <p>It uses real data from the ACCC, AIP, and ABS.</p>
          </div>

          <p className="pt-2">
            Economic modelling: pending validation by the Grattan Institute.
          </p>
          <p>
            If my numbers are wrong, open an issue on GitHub.
            <br />
            If you can improve the code, submit a pull request.
            <br />
            If you're a journalist, the data sources are all cited below.
          </p>
        </div>
      </div>
    </section>
  );
}
