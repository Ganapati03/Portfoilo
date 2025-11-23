import { motion } from "framer-motion";
import { Code2, Database, Palette, Zap } from "lucide-react";

const skills = [
  {
    category: "Frontend",
    icon: Code2,
    items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: "Backend",
    icon: Database,
    items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "GraphQL"],
  },
  {
    category: "Design",
    icon: Palette,
    items: ["Figma", "UI/UX", "Responsive Design", "Prototyping", "Design Systems"],
  },
  {
    category: "Tools",
    icon: Zap,
    items: ["Git", "Docker", "AWS", "CI/CD", "Jest"],
  },
];

export const Skills = () => {
  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Skills & Expertise</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-strong p-6 rounded-2xl border border-primary/20 glow-hover-cyan group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all">
                  <skill.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{skill.category}</h3>
              </div>
              <div className="space-y-2">
                {skill.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
