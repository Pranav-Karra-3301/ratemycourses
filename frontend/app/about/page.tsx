// About page explains why the app uses wallet auth, blockchain metadata, and decentralized storage.
export default function AboutPage() {
  const items = [
    {
      title: "Censorship resistance",
      body: "Review metadata is written to a smart contract, so the platform cannot silently remove an unpopular review."
    },
    {
      title: "Transparent reputation",
      body: "Voting and reputation are public contract state. Anyone can inspect why a review is ranked highly."
    },
    {
      title: "Low-cost storage",
      body: "Long review text lives behind an IPFS-style content hash. The contract stores the durable pointer and rating metadata."
    }
  ];

  return (
    <div className="space-y-8">
      <header className="border-b border-line pb-6">
        <p className="font-mono text-xs uppercase text-accent">About</p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-tight text-paper">
          A course review board with public rules instead of hidden moderation.
        </h1>
      </header>
      <section className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article key={item.title} className="border border-line bg-panel p-5">
            <h2 className="font-serif text-3xl text-paper">{item.title}</h2>
            <p className="mt-4 text-sm leading-6 text-muted">{item.body}</p>
          </article>
        ))}
      </section>
      <section className="border border-line bg-panel p-5">
        <h2 className="font-serif text-4xl text-paper">How it works</h2>
        <div className="mt-5 grid gap-3 font-mono text-xs uppercase text-muted md:grid-cols-4">
          <div className="border border-line p-3">1 / Connect wallet</div>
          <div className="border border-line p-3">2 / Write review</div>
          <div className="border border-line p-3">3 / Store content hash</div>
          <div className="border border-line p-3">4 / Vote on usefulness</div>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="font-serif text-4xl text-paper">FAQ</h2>
        <details className="border border-line bg-panel p-4">
          <summary className="cursor-pointer font-mono text-xs uppercase text-accent">Can reviews be edited?</summary>
          <p className="mt-3 text-sm leading-6 text-muted">No. The registry treats submitted review metadata as immutable.</p>
        </details>
        <details className="border border-line bg-panel p-4">
          <summary className="cursor-pointer font-mono text-xs uppercase text-accent">Why use a wallet?</summary>
          <p className="mt-3 text-sm leading-6 text-muted">
            Wallets let users submit transactions and build reputation without collecting school logins or personal identity.
          </p>
        </details>
      </section>
    </div>
  );
}
