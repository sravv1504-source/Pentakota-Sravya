import { QuestionItem } from '../types';

export const QUESTIONS_DATA: QuestionItem[] = [
  // =================== PYTHON ===================
  {
    id: 'py-01',
    domain: 'python',
    difficulty: 'easy',
    title: 'Lists vs. Tuples & Mutability',
    question: 'Can you explain the key difference between lists and tuples in Python, and when would you choose one over the other?',
    introvertTip: 'Take a 2-second breath before answering. State the single biggest distinction in your first sentence ("Mutability"), then give one concrete use case. Brevity is a superpower.',
    starFramework: {
      situation: 'In a high-throughput data processing microservice, memory overhead became critical.',
      task: 'Optimize data structures holding static geographical coordinates.',
      action: 'Swapped dynamic lists for immutable tuples, leveraging Python memory optimization and preventing accidental mutations.',
      result: 'Reduced memory footprint by 24% and improved cache locality.',
    },
    sampleAnswer: 'The fundamental difference between lists and tuples in Python comes down to mutability and memory allocation. Lists are mutable—meaning their elements can be added, removed, or modified after creation using dynamic array resizing. Tuples are immutable and fixed upon instantiation. Because tuples are immutable, Python allocates a single block of memory with no over-allocation buffer, making them slightly faster and lighter. I choose tuples for fixed constants or dictionary keys (like geographic coordinates or database record shapes), and lists when items need dynamic sorting or appending.',
    keyPoints: [
      'Lists are mutable dynamic arrays (square brackets [])',
      'Tuples are immutable fixed sequences (parentheses ())',
      'Tuples can be used as dictionary keys if their contents are hashable',
      'Tuples consume less memory and protect data integrity',
    ],
    codeSnippet: `# Immutable tuple vs dynamic list
coords = (37.7749, -122.4194)  # Fixed GPS (Hashable, safe)
user_tags = ["python", "introvert", "fast"]  # Dynamic collection
user_tags.append("backend")`,
    tags: ['Python', 'Data Structures', 'Memory'],
  },
  {
    id: 'py-02',
    domain: 'python',
    difficulty: 'medium',
    title: 'Generators & Memory Efficiency (yield vs return)',
    question: 'How do Python generators work under the hood, and how do they prevent out-of-memory errors when processing massive datasets?',
    introvertTip: 'If your heart is pounding, visualize the conveyor belt metaphor: instead of cooking 10,000 burgers at once, a generator serves one at a time. This keeps your answer visual and grounded.',
    starFramework: {
      situation: 'Our ETL pipeline crashed with OOM errors while parsing a 12GB server log file in memory.',
      task: 'Refactor the log aggregation parser to stream data line-by-line without loading the entire file into RAM.',
      action: 'Replaced a list comprehension with a generator expression utilizing Python yield keyword to produce an iterator conforming to the iterator protocol.',
      result: 'RAM usage dropped from 14GB down to a steady 35MB, running seamlessly on basic cloud instances.',
    },
    sampleAnswer: 'Python generators are functions that return a generator iterator using the "yield" keyword instead of "return". When a generator yields a value, execution pauses, preserving its local execution state, variable pointers, and instruction pointer. When next() is called again, it resumes immediately after the yield. Under the hood, this implements lazy evaluation via the iterator protocol (__iter__ and __next__). Rather than allocating space for millions of items in a list simultaneously (O(N) space), a generator maintains O(1) auxiliary memory because only one element exists in RAM at any given moment.',
    keyPoints: [
      'Generators use lazy evaluation (compute on demand)',
      'Yield pauses execution and preserves local stack frame',
      'Reduces spatial memory complexity from O(N) to O(1)',
      'Implements the standard Python iterator protocol',
    ],
    codeSnippet: `def stream_large_dataset(filepath):
    """Streams lines one-by-one with O(1) memory overhead."""
    with open(filepath, 'r') as file:
        for line in file:
            if "ERROR" in line:
                yield line.strip()

# Only one line stays in memory at any point
for error in stream_large_dataset("system.log"):
    process_alert(error)`,
    tags: ['Python', 'Generators', 'Memory Management', 'Async'],
  },
  {
    id: 'py-03',
    domain: 'python',
    difficulty: 'hard',
    title: 'GIL (Global Interpreter Lock) & Concurrency Architecture',
    question: 'What is Python GIL, why does it exist in CPython, and how do you design a high-performance system that overcomes its CPU-bound limitations?',
    introvertTip: 'Remember: the interviewer does not expect you to speak fast. Deep, thoughtful thinkers structure points by category: (1) What GIL is, (2) Why it exists, (3) Solutions: Multiprocessing vs. AsyncIO vs. Native Extensions.',
    starFramework: {
      situation: 'Our image processing backend was utilizing only 1 out of 16 CPU cores due to threading GIL lock contention.',
      task: 'Maximize multi-core throughput on a dedicated compute server.',
      action: 'Architected a process pool via concurrent.futures.ProcessPoolExecutor with shared memory buffers, isolating CPU-bound transforms across separate interpreter instances.',
      result: 'Achieved 14.8x speedup across 16 cores, dropping 99th percentile processing latency from 4.2s to 280ms.',
    },
    sampleAnswer: 'The Global Interpreter Lock (GIL) is a mutex in CPython that ensures only one native thread executes Python bytecode at any given moment. It was originally implemented to make CPython memory management thread-safe, particularly reference counting for garbage collection, without requiring fine-grained locks on every single object. For I/O-bound tasks (like network calls or disk reads), the GIL is released, allowing threading or asyncio to achieve great concurrency. However, for CPU-bound tasks, standard multithreading cannot leverage multiple CPU cores. To bypass this, we use multiprocessing—where each process gets its own Python interpreter and GIL—or offload intensive computation to C/Rust extensions (like NumPy) which release the GIL during native calculation.',
    keyPoints: [
      'CPython mutex preventing simultaneous bytecode execution',
      'Protects CPython reference counting garbage collection',
      'I/O bound works well with asyncio or threading because GIL is released during I/O',
      'CPU bound requires multiprocessing, ProcessPoolExecutor, or C/Rust extensions',
    ],
    codeSnippet: `from concurrent.futures import ProcessPoolExecutor
import multiprocessing

def compute_heavy_task(data_chunk):
    # Runs in dedicated process with its own GIL
    return sum(x ** 2 for x in data_chunk)

if __name__ == '__main__':
    chunks = [range(1000000) for _ in range(multiprocessing.cpu_count())]
    with ProcessPoolExecutor() as executor:
        results = list(executor.map(compute_heavy_task, chunks))`,
    tags: ['Python', 'GIL', 'Concurrency', 'Multiprocessing'],
  },

  // =================== JAVASCRIPT & TYPESCRIPT ===================
  {
    id: 'js-01',
    domain: 'javascript',
    difficulty: 'easy',
    title: 'Event Loop & Microtask vs Macrotask Queue',
    question: 'Explain how JavaScript handles asynchronous operations despite being single-threaded. What is the execution order between Promises and setTimeout?',
    introvertTip: 'Take your time. A great visual trick is to imagine two lines at a ticket counter: VIP tickets (Microtasks/Promises) always get served before regular tickets (Macrotasks/setTimeout).',
    starFramework: {
      situation: 'A race condition caused UI flickers during an authentication handshake.',
      task: 'Understand why a setTimeout callback executed after a resolved Promise and synchronize state updates.',
      action: 'Mapped the JavaScript event loop call stack, microtask queue, and macrotask queue to orchestrate updates with queueMicrotask and requestAnimationFrame.',
      result: 'Eliminated UI jank and eliminated 100% of the race conditions.',
    },
    sampleAnswer: 'JavaScript runs on a single-threaded event loop with one call stack. When an asynchronous operation occurs, the browser or Node runtime delegates it to background Web APIs. When complete, callbacks enter queues. There are two primary queues: Microtasks (which include resolved Promise callbacks and queueMicrotask) and Macrotasks (which include setTimeout, setInterval, and I/O events). The event loop checks if the call stack is empty. Once empty, it exhausts the ENTIRE microtask queue first before executing a single macrotask. Therefore, a Promise.then() will always execute before a setTimeout(..., 0).',
    keyPoints: [
      'Single-threaded execution with a single call stack',
      'Microtask queue has absolute priority over the Macrotask queue',
      'Promises and MutationObservers queue microtasks',
      'setTimeout and setInterval queue macrotasks',
    ],
    codeSnippet: `console.log('1: Sync');
setTimeout(() => console.log('2: Macrotask (setTimeout)'), 0);
Promise.resolve().then(() => console.log('3: Microtask (Promise)'));
console.log('4: Sync');

// Output order: 1, 4, 3, 2`,
    tags: ['JavaScript', 'Event Loop', 'Async', 'Promises'],
  },
  {
    id: 'js-02',
    domain: 'javascript',
    difficulty: 'medium',
    title: 'Closures & Lexical Scope in Production',
    question: 'What is a closure in JavaScript, how does lexical scoping create it, and what are real-world architectural applications and memory risks?',
    introvertTip: 'Quiet confidence comes from simplicity: "A closure is simply a function bundled together with its surrounding lexical state." Breathe and let that definition land.',
    starFramework: {
      situation: 'Needed to implement a rate-limiter and private state token manager without exposing sensitive secrets on window.',
      task: 'Encapsulate private state securely in client-side modules without class overhead.',
      action: 'Created a factory function utilizing closure scope to house private counters and cryptographic tokens.',
      result: 'Prevented third-party browser extensions from reading internal session keys.',
    },
    sampleAnswer: 'A closure is the combination of a function bundled together with references to its surrounding state—its lexical environment. In JavaScript, functions retain access to variables declared in their outer parent scope even after the parent function has finished executing and returned. This happens because the internal function maintains a reference to the outer scope on the heap. Real-world applications include data privacy (private variables), function currying, and memoization caches. A common risk is accidental memory leaks if long-lived event listeners or intervals retain references to large DOM trees or variables in their closed-over scope.',
    keyPoints: [
      'Function remembers and accesses variables from its outer lexical environment',
      'Provides true encapsulation and private variables',
      'Underpins functional patterns like memoization, currying, and factory closures',
      'Potential memory leak risk if unused references are held indefinitely',
    ],
    codeSnippet: `function createRateLimiter(maxCalls = 5) {
    let callCount = 0; // Private state protected by closure
    return function() {
        if (callCount >= maxCalls) {
            throw new Error("Rate limit exceeded. Please wait.");
        }
        callCount++;
        return \`Operation allowed. Remaining: \${maxCalls - callCount}\`;
    };
}
const limiter = createRateLimiter(3);`,
    tags: ['JavaScript', 'Closures', 'Scope', 'Architecture'],
  },
  {
    id: 'js-03',
    domain: 'javascript',
    difficulty: 'hard',
    title: 'TypeScript Advanced Generics, Conditional & Mapped Types',
    question: 'How do TypeScript conditional types (T extends U ? X : Y) and distributive property work, and how would you build a type-safe DeepReadonly or DeepPartial utility?',
    introvertTip: 'When solving complex type system questions, walk the interviewer through your thought process: base case first, recursive step second. You do not need to rush.',
    starFramework: {
      situation: 'Our multi-tenant state store allowed accidental direct mutations on nested Redux entities in complex feature branches.',
      task: 'Enforce compile-time immutability across deeply nested configuration trees.',
      action: 'Engineered a recursive DeepReadonly mapped conditional type using keyof and infer.',
      result: 'Caught 43 silent mutation bugs at compile time before hitting staging.',
    },
    sampleAnswer: 'TypeScript conditional types take the form "T extends U ? X : Y", evaluating types based on relationships. When applied to naked type parameters in union types, they distribute across the union (Distributive Conditional Types). To build a robust DeepReadonly, we combine conditional types with mapped types and recursive unwrapping. We check if T is a primitive (string, number, function, etc.); if so, we leave it unchanged. If it is an array or object, we recursively map over its keys using "readonly [K in keyof T]: DeepReadonly<T[K]>". This guarantees end-to-end type safety without runtime overhead.',
    keyPoints: [
      'Conditional types evaluate type assignments at compile time',
      'Distributive behavior splits unions into individual branches',
      'Recursive mapped types enable deep immutability transformations',
      'Zero runtime overhead—100% compile-time verification',
    ],
    codeSnippet: `type Primitive = string | number | boolean | bigint | symbol | null | undefined | Function;

export type DeepReadonly<T> = T extends Primitive
    ? T
    : T extends Map<infer K, infer V>
    ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
    : T extends Set<infer M>
    ? ReadonlySet<DeepReadonly<M>>
    : { readonly [K in keyof T]: DeepReadonly<T[K]> };`,
    tags: ['TypeScript', 'Generics', 'Advanced Types', 'Type Safety'],
  },

  // =================== JAVA ===================
  {
    id: 'java-01',
    domain: 'java',
    difficulty: 'easy',
    title: 'JVM Memory Model: Heap vs Stack',
    question: 'What is the difference between Heap memory and Stack memory in the Java Virtual Machine, and how does Garbage Collection interact with them?',
    introvertTip: 'Keep your posture open. Place both feet firmly on the ground. State Heap vs Stack clearly: Stack is fast and thread-isolated; Heap is shared and managed by GC.',
    starFramework: {
      situation: 'Investigated a StackOverflowError versus OutOfMemoryError in a high-volume financial transaction service.',
      task: 'Configure JVM tuning flags (-Xms, -Xmx, -Xss) appropriately for microservice pods.',
      action: 'Segregated short-lived primitive calculation frames on thread stacks and cached reference objects on the heap.',
      result: 'Eliminated heap fragmentation and reduced garbage collection pause times by 65%.',
    },
    sampleAnswer: 'In the JVM, Stack memory is thread-private and used for executing threads. It stores local primitive variables, temporary method execution frames, and references to objects. When a method returns, its stack frame is instantly popped in LIFO order with zero garbage collection overhead. In contrast, Heap memory is shared across all threads and houses all actual instantiated objects and instance variables. Garbage Collection operates almost exclusively on the Heap—using generational collectors (like G1 or ZGC) to mark, sweep, and compact unreferenced objects in Eden, Survivor, and Tenured spaces.',
    keyPoints: [
      'Stack memory is thread-local, fast, and stores call frames and primitives',
      'Heap memory is globally shared and stores instantiated objects',
      'Stack automatically deallocates when methods exit; Heap relies on Garbage Collector',
      'StackOverflowError relates to deep recursion; OutOfMemoryError relates to exhausted heap',
    ],
    codeSnippet: `public class MemoryDemo {
    public void execute() {
        int localPrimitive = 42; // Allocated on the Thread Stack
        UserAccount account = new UserAccount("Alice"); // Reference on Stack, Object on Heap
    }
}`,
    tags: ['Java', 'JVM', 'Garbage Collection', 'Memory'],
  },
  {
    id: 'java-02',
    domain: 'java',
    difficulty: 'medium',
    title: 'Multithreading & Synchronization (synchronized vs ReentrantLock)',
    question: 'Compare the synchronized keyword with ReentrantLock in Java. When would you prefer ReentrantLock in a high-concurrency enterprise system?',
    introvertTip: 'Introverts are natural analysts. You do not need to give a sales pitch; simply present the pros and cons objectively like an engineer evaluating trade-offs.',
    starFramework: {
      situation: 'A deadlocked bank ledger thread pool was causing order timeouts during peak market open.',
      task: 'Eliminate deadlocks while maintaining strict thread safety for balance updates.',
      action: 'Replaced blunt synchronized blocks with ReentrantLock using tryLock with timeouts and fair queueing.',
      result: 'Completely eliminated thread deadlocks and achieved deterministic 50ms recovery windows.',
    },
    sampleAnswer: 'Both "synchronized" and "ReentrantLock" provide mutual exclusion and reentrancy in Java. However, "synchronized" is an implicit language-level construct tied to intrinsic object monitors; it is automatically acquired and released upon leaving the block, making it simple and exception-safe. "ReentrantLock" is an explicit class from java.util.concurrent.locks offering advanced capabilities: non-blocking acquisition via tryLock(), lock acquisition with timeouts, interruptible lock acquisition, and fair lock scheduling. In enterprise systems where deadlocks or thread starvation can occur, ReentrantLock is preferred because tryLock(timeout) prevents threads from waiting indefinitely.',
    keyPoints: [
      'synchronized is implicit, scoped to code block, and handled by JVM',
      'ReentrantLock provides explicit lock() and unlock() in a finally block',
      'tryLock(timeout) allows graceful timeout handling without blocking forever',
      'Supports Fair locking policies to prevent thread starvation',
    ],
    codeSnippet: `Lock lock = new ReentrantLock();

public void transferFunds(Account to, double amount) throws InterruptedException {
    if (lock.tryLock(500, TimeUnit.MILLISECONDS)) {
        try {
            // Critical section with mutual exclusion
            withdraw(amount);
            to.deposit(amount);
        } finally {
            lock.unlock(); // Always release in finally block!
        }
    } else {
        // Fallback or retry logic on contention
    }
}`,
    tags: ['Java', 'Concurrency', 'Locks', 'Multithreading'],
  },
  {
    id: 'java-03',
    domain: 'java',
    difficulty: 'hard',
    title: 'Java Concurrency: CompletableFuture vs Virtual Threads (Project Loom)',
    question: 'How do Java 21 Virtual Threads (Project Loom) revolutionize concurrent server architecture compared to traditional thread pools and reactive CompletableFuture pipelines?',
    introvertTip: 'Anchor yourself in the fundamental shift: moving from carrier OS threads (1MB each) to lightweight user-mode virtual threads (few hundred bytes each).',
    starFramework: {
      situation: 'Our Spring Boot REST API was hitting memory and OS thread limits at 5,000 concurrent socket connections.',
      task: 'Scale throughput to 50,000 concurrent long-polling connections without rewriting the entire codebase into reactive WebFlux.',
      action: 'Upgraded to Java 21 and configured the server executor to use Executors.newVirtualThreadPerTaskExecutor().',
      result: 'Supported 65,000 concurrent connections while keeping straightforward synchronous, debuggable code.',
    },
    sampleAnswer: 'Historically, Java platform threads had a 1:1 mapping with operating system kernel threads. Each consumed approximately 1MB of stack memory, limiting servers to a few thousand threads before exhaustion, which forced developers into complex reactive pipelines. Java 21 Virtual Threads decouple Java threads from OS threads (an M:N model). Virtual threads are lightweight user-space threads managed directly by the JVM. When a virtual thread performs a blocking I/O operation (like a database query or HTTP call), the JVM unmounts it from its carrier OS thread, allowing another virtual thread to run. This lets developers write clean, readable synchronous blocking code while achieving the high throughput of asynchronous architectures.',
    keyPoints: [
      'Platform threads: 1:1 OS mapping, heavy memory footprint (~1MB stack)',
      'Virtual threads: M:N lightweight JVM-managed threads (~few hundred bytes)',
      'JVM automatically unmounts virtual threads during blocking I/O operations',
      'Preserves synchronous programming style and full stack-trace observability',
    ],
    codeSnippet: `// Java 21 Virtual Thread Per Task
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 50_000).forEach(i -> {
        executor.submit(() -> {
            // Blocking I/O runs efficiently without pinning the OS thread
            Thread.sleep(Duration.ofSeconds(1));
            return fetchUserData(i);
        });
    });
}`,
    tags: ['Java', 'Virtual Threads', 'Project Loom', 'Architecture'],
  },

  // =================== C++ / C# ===================
  {
    id: 'cpp-01',
    domain: 'cpp',
    difficulty: 'easy',
    title: 'Stack vs Heap & Smart Pointers (RAII)',
    question: 'What is RAII (Resource Acquisition Is Initialization) in C++, and how do std::unique_ptr and std::shared_ptr enforce safe memory management?',
    introvertTip: 'Take a calm breath. Remember RAII is simply about ownership: when an object goes out of scope, its destructor cleans up automatically. No manual delete needed.',
    starFramework: {
      situation: 'A legacy 3D game engine suffered severe memory leaks during scene transitions.',
      task: 'Modernize raw pointers to modern C++ smart pointers to guarantee deterministic cleanup.',
      action: 'Refactored raw new/delete pairs to std::unique_ptr with std::make_unique, enforcing clear ownership semantics.',
      result: 'Completely eradicated memory leaks and double-free segmentation faults.',
    },
    sampleAnswer: 'RAII is a core C++ programming idiom where resource lifetime is bound to object lifetime. When a stack-allocated object is created, its constructor acquires resources (memory, file handles, or mutexes); when the object goes out of scope, its destructor automatically releases those resources. Modern C++ smart pointers implement RAII to prevent leaks. std::unique_ptr represents exclusive ownership—it cannot be copied, only moved, and frees memory when it leaves scope with zero runtime overhead. std::shared_ptr implements shared ownership via an atomic reference count control block, deleting the underlying object only when the last shared_ptr is destroyed.',
    keyPoints: [
      'RAII ties resource cleanup to object lifetime and destructor invocation',
      'std::unique_ptr provides exclusive ownership with zero overhead (move-only)',
      'std::shared_ptr provides shared ownership via reference counting',
      'Prevents memory leaks, double free errors, and dangling pointers',
    ],
    codeSnippet: `#include <memory>
#include <iostream>

struct DeviceContext {
    void process() { std::cout << "Processing\\n"; }
};

void runEngine() {
    // Exclusive ownership: automatically destroyed when exiting runEngine
    auto device = std::make_unique<DeviceContext>();
    device->process();
} // Destructor runs automatically here!`,
    tags: ['C++', 'Memory', 'RAII', 'Smart Pointers'],
  },
  {
    id: 'cpp-02',
    domain: 'cpp',
    difficulty: 'medium',
    title: 'Move Semantics & Rvalue References (std::move)',
    question: 'Explain move semantics and rvalue references (&&) introduced in C++11. How do they eliminate expensive deep copies in collections and strings?',
    introvertTip: 'Use a physical analogy: Instead of printing a brand new duplicate 500-page book and shredding the original, moving is simply handing over the keys to the existing book.',
    starFramework: {
      situation: 'A telemetry parser in an embedded robotics controller was dropping packets due to vector copy overhead.',
      task: 'Eliminate redundant buffer copies when pushing large vector payloads into queue buffers.',
      action: 'Implemented move constructors and move assignment operators using std::move and rvalue references.',
      result: 'Vector transfer cost plummeted from O(N) allocation to O(1) pointer swap, boosting packet rate 4x.',
    },
    sampleAnswer: 'Before C++11, passing or returning large heap objects (like std::vector or std::string) by value often resulted in expensive deep copies, allocating fresh heap memory and copying every byte. Move semantics solved this by introducing rvalue references (denoted by "&&"), which bind to temporary objects about to be destroyed. Move constructors and move assignment operators "steal" the internal pointers and buffer allocations from the temporary source object and leave it in a valid but empty state. std::move does not actually move anything at runtime; it is a compile-time cast that converts an lvalue into an rvalue reference, enabling the move constructor to be selected.',
    keyPoints: [
      'Rvalue references (T&&) bind to temporary, expiring objects',
      'Move semantics transfer pointer ownership rather than duplicating heap memory',
      'Converts expensive O(N) copy operations into instantaneous O(1) pointer swaps',
      'std::move is an unconditional static_cast to an rvalue reference',
    ],
    codeSnippet: `std::vector<int> generateHeavyData() {
    std::vector<int> largeVec(1000000, 1);
    return largeVec; // Automatically moved via Return Value Optimization / Move Semantics
}

std::vector<int> storage;
// std::move signals that tempBuffer can have its pointers stolen
storage = std::move(largeVec); // O(1) pointer swap, zero reallocations`,
    tags: ['C++', 'Move Semantics', 'Performance', 'Pointers'],
  },
  {
    id: 'cpp-03',
    domain: 'cpp',
    difficulty: 'hard',
    title: 'Lock-Free Programming & Memory Ordering (std::atomic)',
    question: 'What are std::memory_order_relaxed, memory_order_acquire, and memory_order_release in C++? How do you prevent CPU instruction reordering without heavy mutexes?',
    introvertTip: 'This is a pinnacle topic. Speak slowly. Focus on the core contract: "Acquire ensures subsequent reads see previous writes; Release ensures all prior writes are visible before this store."',
    starFramework: {
      situation: 'High-frequency trading order matching engine suffered severe CPU cache invalidation bottlenecks from OS mutexes.',
      task: 'Implement a lock-free single-producer single-consumer ring buffer queue.',
      action: 'Employed std::atomic with memory_order_acquire and memory_order_release to enforce strict memory fences without full atomic bus locks.',
      result: 'Queue latency dropped to sub-microsecond levels with zero lock contention.',
    },
    sampleAnswer: 'In modern multi-core processors, both compilers and CPUs reorder read and write instructions for optimization, and CPU caches propagate changes asynchronously. By default, C++ atomics use sequential consistency (std::memory_order_seq_cst), which imposes a globally synchronized execution order across all threads, but incurs significant hardware overhead. Relaxed ordering (memory_order_relaxed) guarantees atomic access without any synchronization or ordering constraints. The acquire-release model provides fine-grained synchronization: a store operation with "memory_order_release" guarantees that all prior memory writes are visible to another thread that performs a load with "memory_order_acquire" on the same atomic variable.',
    keyPoints: [
      'Compilers and CPUs reorder instructions unless constrained by memory barriers',
      'Sequential consistency (seq_cst) is safe but has the highest performance penalty',
      'Acquire-Release semantics synchronize data between producer and consumer without full bus locks',
      'Crucial for high-performance lock-free queues, ring buffers, and concurrent primitives',
    ],
    codeSnippet: `std::atomic<bool> ready{false};
int payload = 0;

void producer() {
    payload = 42; // Normal store
    ready.store(true, std::memory_order_release); // Barrier: payload write visible first
}

void consumer() {
    while (!ready.load(std::memory_order_acquire)); // Synchronizes with release
    std::cout << payload << std::endl; // Guaranteed to be 42!
}`,
    tags: ['C++', 'Lock-Free', 'Atomics', 'Low-Latency'],
  },

  // =================== SQL & DATABASES ===================
  {
    id: 'sql-01',
    domain: 'sql',
    difficulty: 'easy',
    title: 'Indexing: B-Tree Fundamentals & Index Scans',
    question: 'How does a B-Tree index speed up SELECT queries in SQL, and when might an index actually degrade database performance?',
    introvertTip: 'Start with the textbook index analogy: A book index lets you jump straight to page 142 instead of reading every page from page 1. Keep it clear and relatable.',
    starFramework: {
      situation: 'Candidate search endpoint took 3.8 seconds on a table with 2 million user records.',
      task: 'Optimize query performance for filtering by email and registration date.',
      action: 'Analyzed EXPLAIN ANALYZE output and added a composite B-Tree index on (registration_date, email).',
      result: 'Query execution time dropped from 3800ms down to 11ms via index seek.',
    },
    sampleAnswer: 'A B-Tree (Balanced Tree) index organizes column values in a self-balancing hierarchical tree structure. Instead of performing a sequential Table Scan (O(N) operations reading every page from disk), the database traverses the tree from root to leaf in O(log N) operations to locate matching row pointers. However, indexes are not free. Every INSERT, UPDATE, and DELETE operation must also update every index on that table, which introduces write amplification and disk I/O overhead. Additionally, indexes consume disk and RAM space in the buffer pool. Adding too many indexes on high-write, low-read tables will degrade overall system throughput.',
    keyPoints: [
      'B-Tree indexes reduce search time from O(N) full table scan to O(log N) index seek',
      'Composite indexes require following the leftmost prefix rule',
      'Indexes speed up reads but slow down writes (INSERT, UPDATE, DELETE)',
      'Consumes storage space and buffer pool RAM cache',
    ],
    codeSnippet: `-- Creates a composite B-Tree index
CREATE INDEX idx_users_status_created 
ON users(status, created_at DESC);

-- Fast Index Seek
EXPLAIN ANALYZE 
SELECT id, email FROM users 
WHERE status = 'ACTIVE' AND created_at >= '2026-01-01';`,
    tags: ['SQL', 'Indexes', 'Performance', 'B-Tree'],
  },
  {
    id: 'sql-02',
    domain: 'sql',
    difficulty: 'medium',
    title: 'ACID Properties & Transaction Isolation Levels',
    question: 'Walk through the 4 SQL transaction isolation levels. What concurrency anomalies (Dirty Read, Non-repeatable Read, Phantom Read) does each prevent?',
    introvertTip: 'Structure is the introvert secret weapon. Draw a mental ladder: Read Uncommitted -> Read Committed -> Repeatable Read -> Serializable. Explain each rung.',
    starFramework: {
      situation: 'An inventory checkout bug allowed double-selling limited-edition merchandise during holiday flash sales.',
      task: 'Prevent phantom reads and race conditions on stock quantities.',
      action: 'Elevated checkout transaction isolation to Serializable and introduced row-level SELECT FOR UPDATE pessimistic locking.',
      result: 'Zero inventory discrepancies across over 250,000 flash sale transactions.',
    },
    sampleAnswer: 'The SQL standard defines 4 transaction isolation levels to balance concurrency with data integrity. 1) Read Uncommitted allows transactions to read uncommitted data from other transactions, which can result in Dirty Reads. 2) Read Committed only permits reading committed data, preventing Dirty Reads; however, Non-repeatable Reads can occur if another transaction modifies and commits data between two reads. 3) Repeatable Read ensures that any row read during a transaction retains its initial state across re-reads, preventing Non-repeatable Reads (though Phantom Reads from newly inserted rows can still happen). 4) Serializable is the highest level, executing transactions with complete serial order isolation, preventing all anomalies at the cost of reduced concurrency.',
    keyPoints: [
      'Read Uncommitted: Lowest isolation, permits Dirty Reads',
      'Read Committed: Prevents Dirty Reads (standard default in PostgreSQL/SQL Server)',
      'Repeatable Read: Prevents Dirty and Non-repeatable Reads (standard default in MySQL InnoDB)',
      'Serializable: Full serial execution, prevents Phantom Reads, highest lock overhead',
    ],
    codeSnippet: `-- Setting transaction isolation in PostgreSQL
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;

SELECT current_balance FROM accounts WHERE account_id = 1001;
-- Balance guaranteed consistent throughout transaction lifecycle
UPDATE accounts SET current_balance = current_balance - 100 WHERE account_id = 1001;

COMMIT;`,
    tags: ['SQL', 'Transactions', 'ACID', 'Concurrency'],
  },
  {
    id: 'sql-03',
    domain: 'sql',
    difficulty: 'hard',
    title: 'Distributed Database Partitioning, Sharding & Consistent Hashing',
    question: 'How do you design a database sharding strategy for a multi-terabyte platform? Compare Range, Hash, and Directory sharding, and how Consistent Hashing handles node resizing.',
    introvertTip: 'Break the problem down logically: (1) The problem with single-node scaling, (2) Choosing the Shard Key, (3) Resizing nodes without full-cluster rebalancing.',
    starFramework: {
      situation: 'Our primary PostgreSQL cluster hit 12TB storage and reached I/O saturation at 45,000 queries per second.',
      task: 'Horizontally shard customer order history across a cluster of 8 database nodes.',
      action: 'Selected organization_id as shard key and implemented Consistent Hashing using virtual v-nodes on a hash ring.',
      result: 'Evenly distributed load with zero hotspots, allowing new nodes to be added with only 1/N data re-shuffling.',
    },
    sampleAnswer: 'Database sharding horizontally partitions data across multiple independent database instances. The most critical decision is selecting the Shard Key to avoid cross-shard JOINs and write hotspots. In Range Sharding, rows are partitioned by continuous ranges (e.g., Dates or Alphabetic ranges); this makes range queries easy but frequently creates hotspots on recent data. Hash Sharding hashes the key modulo the number of shards (hash(key) % N), producing an even distribution. However, when N changes during scaling, almost all keys must be remapped. Consistent Hashing solves this by mapping both nodes and keys onto a circular 360-degree hash ring with virtual nodes. When a new node is added, only keys adjacent to that node on the ring need to migrate, preventing full-cluster downtime.',
    keyPoints: [
      'Shard key selection determines distribution balance and query routing efficiency',
      'Avoid cross-shard joins by co-locating related entity tables under the same tenant ID',
      'Hash Sharding distributes evenly; Range Sharding risks timestamp hotspots',
      'Consistent Hashing limits data re-balancing to only K/N keys when cluster scales',
    ],
    codeSnippet: `-- Shard routing concept in application layer
def get_target_shard_node(customer_id: str, hash_ring) -> str:
    """Uses consistent hashing to route queries to dedicated shard."""
    key_hash = sha256(customer_id.encode()).hexdigest()
    node = hash_ring.get_node(key_hash)
    return node.connection_string`,
    tags: ['Databases', 'Sharding', 'Consistent Hashing', 'Scalability'],
  },

  // =================== SYSTEM DESIGN ===================
  {
    id: 'sys-01',
    domain: 'system-design',
    difficulty: 'easy',
    title: 'Load Balancing & Horizontal vs. Vertical Scaling',
    question: 'Explain the difference between Horizontal and Vertical scaling, and describe how a Reverse Proxy / Load Balancer distributes incoming web traffic.',
    introvertTip: 'Do not feel rushed to sketch a 20-component diagram. Start with simple principles: adding horsepower to one machine vs. adding more friendly machines to the team.',
    starFramework: {
      situation: 'Our web app crashed during an unexpected press release influx of 100,000 visitors.',
      task: 'Design a resilient architecture that scales automatically with traffic spikes.',
      action: 'Decoupled monolithic server into stateless instances behind an Nginx / AWS ALB load balancer using Round Robin and Least Connections routing.',
      result: 'Maintained 99.99% uptime with zero single point of failure.',
    },
    sampleAnswer: 'Vertical scaling (scaling up) means upgrading the hardware of a single server by adding more CPUs, RAM, or SSD storage. It is simple because it requires no architectural refactoring, but it has hard hardware ceilings, exponential cost curves, and creates a single point of failure. Horizontal scaling (scaling out) means adding more machine instances running the application in parallel. To make this work, application servers must be stateless. A Load Balancer (like Nginx, HAProxy, or AWS ALB) sits in front of the instances as a reverse proxy, receiving client requests and distributing them using algorithms such as Round Robin, Least Connections, or IP Hash, while performing continuous health checks to reroute traffic away from failing servers.',
    keyPoints: [
      'Vertical scaling adds capacity to one box; Horizontal scaling adds more boxes',
      'Horizontal scaling requires stateless application layers and shared persistence',
      'Load balancers distribute requests via algorithms (Round Robin, Least Connections)',
      'Continuous health checks prevent routing traffic to unhealthy instances',
    ],
    codeSnippet: `# Nginx upstream configuration for horizontal load balancing
upstream backend_app_pool {
    least_conn; # Routes traffic to server with fewest active connections
    server app-worker-01.internal:8080 max_fails=3 fail_timeout=10s;
    server app-worker-02.internal:8080 max_fails=3 fail_timeout=10s;
    server app-worker-03.internal:8080 backup;
}`,
    tags: ['System Design', 'Load Balancing', 'Scalability', 'High Availability'],
  },
  {
    id: 'sys-02',
    domain: 'system-design',
    difficulty: 'medium',
    title: 'Caching Strategies & Cache Invalidation (Cache-Aside vs Write-Through)',
    question: 'Compare Cache-Aside, Write-Through, and Write-Behind caching patterns. How do you mitigate Cache Stampede and Cache Penetration in Redis?',
    introvertTip: 'Remember the classic Phil Karlton quote: "There are only two hard things in Computer Science: cache invalidation and naming things." Saying this with a gentle smile builds instant rapport.',
    starFramework: {
      situation: 'A celebrity profile update caused a sudden database surge that exhausted connection pools (Cache Stampede).',
      task: 'Implement a resilient distributed caching layer in Redis to protect the primary SQL database.',
      action: 'Architected Cache-Aside with distributed mutex locks and probabilistic early expiration (XFetch algorithm).',
      result: 'Database load dropped by 92%, handling over 35,000 read requests per second smoothly.',
    },
    sampleAnswer: 'In Cache-Aside (Lazy Loading), the application reads from cache first; on a cache miss, it reads from the database and populates the cache. In Write-Through, writes are synchronously sent to the cache and the database together, ensuring consistency at the expense of write latency. In Write-Behind (Write-Back), data is immediately written to cache and asynchronously flushed to the database in batches, maximizing write performance but introducing risk of data loss if the cache fails. Cache Stampede occurs when a popular cache key expires and thousands of simultaneous requests hit the database at once. We mitigate this using distributed locks (mutex) or probabilistic early recomputation. Cache Penetration happens when queries for non-existent keys bypass the cache; we fix this using Bloom Filters or caching null results with a short TTL.',
    keyPoints: [
      'Cache-Aside: Reads from cache, populates on miss; fast, resilient, lazy',
      'Write-Through: Synchronously updates cache and DB together',
      'Write-Behind: Asynchronously writes to DB in background batches',
      'Mitigate Stampede with distributed mutex or probabilistic refresh; Penetration with Bloom Filters',
    ],
    codeSnippet: `async function getProfileWithCache(userId) {
    const cached = await redis.get(\`user:\${userId}\`);
    if (cached) return JSON.parse(cached);

    // Acquire lightweight mutex to prevent Cache Stampede
    const lock = await redis.set(\`lock:\${userId}\`, "locked", "NX", "EX", 5);
    if (!lock) {
        await sleep(50);
        return getProfileWithCache(userId); // Retry
    }

    try {
        const user = await db.users.findUnique({ where: { id: userId } });
        // Cache null object with short TTL to prevent Cache Penetration
        await redis.set(\`user:\${userId}\`, JSON.stringify(user || null), "EX", 300);
        return user;
    } finally {
        await redis.del(\`lock:\${userId}\`);
    }
}`,
    tags: ['System Design', 'Redis', 'Caching', 'Architecture'],
  },
  {
    id: 'sys-03',
    domain: 'system-design',
    difficulty: 'hard',
    title: 'Designing a Globally Distributed URL Shortener (TinyURL)',
    question: 'Design a scalable, highly available URL shortener like TinyURL handling 100M new URLs per month and 10B read redirects. Address base62 encoding, database choice, and latency.',
    introvertTip: 'When handed a broad system design prompt, do not panic. Use the 4-step blueprint: (1) Scope & Numbers, (2) High-Level Flow, (3) Deep Dive on Key Generation, (4) Bottlenecks & Caching.',
    starFramework: {
      situation: 'Designed an enterprise link management platform requiring sub-15ms worldwide redirect latencies.',
      task: 'Support 10 billion monthly redirects with 99.999% availability and collisions prevention.',
      action: 'Engineered a Base62 token generator with a distributed Key Generation Service (KGS) and edge CDN Anycast routing.',
      result: 'Delivered 8ms median redirect latency globally with zero token collisions across 5 billion generated links.',
    },
    sampleAnswer: 'To design TinyURL, we begin with traffic estimations: 100 million writes/month (~40 writes/sec) and 10 billion reads/month (~4,000 reads/sec), a 100:1 read-heavy ratio. For generating 7-character short codes, Base62 (a-z, A-Z, 0-9) provides 62^7 ≈ 3.5 trillion unique combinations, more than enough for centuries of use. Rather than hashing long URLs on the fly (which causes collisions and requires lookups), we use a standalone Key Generation Service (KGS) that pre-generates unique 7-character tokens and stores them in memory pools. When a user creates a link, a token is claimed in O(1) time without collision risk. We store the mapping in a distributed NoSQL key-value store (like DynamoDB or Cassandra) where the short code is the partition key. Because 20% of links drive 80% of traffic, we deploy Redis caches and edge CDN proxies to serve 95% of redirects in sub-10ms directly from RAM.',
    keyPoints: [
      'Base62 encoding (62^7 = 3.5 trillion unique combinations)',
      'Pre-generated Key Generation Service (KGS) eliminates hash collisions and retries',
      'NoSQL Key-Value store (DynamoDB/Cassandra) partitioned by short_code',
      'Edge CDN and Redis caching absorbs 95%+ of read redirects for sub-10ms global latency',
    ],
    codeSnippet: `# Base62 Character set encoding logic
BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

def encode_base62(unique_int_id: int) -> str:
    """Converts a 64-bit integer into a 7-character Base62 string."""
    if unique_int_id == 0:
        return BASE62_CHARS[0]
    result = []
    base = len(BASE62_CHARS)
    while unique_int_id > 0:
        unique_int_id, rem = divmod(unique_int_id, base)
        result.append(BASE62_CHARS[rem])
    return "".join(reversed(result)).rjust(7, '0')`,
    tags: ['System Design', 'Distributed Systems', 'NoSQL', 'Scalability'],
  },

  // =================== FRONTEND ===================
  {
    id: 'fe-01',
    domain: 'frontend',
    difficulty: 'easy',
    title: 'Browser Rendering Pipeline & Critical Rendering Path',
    question: 'What steps does the browser take to turn HTML, CSS, and JS into visible pixels on the screen (DOM, CSSOM, Render Tree, Layout, Paint)?',
    introvertTip: 'Speak methodically. Walk the interviewer step-by-step through the pipeline: Parse -> Tree Construction -> Layout -> Paint -> Composite.',
    starFramework: {
      situation: 'Our web app was flagged with poor Google Core Web Vitals (Largest Contentful Paint > 4.8s).',
      task: 'Optimize the Critical Rendering Path to achieve sub-1.5s LCP.',
      action: 'Inlined critical CSS, deferred non-essential JavaScript with async/defer, and eliminated render-blocking font downloads.',
      result: 'LCP improved to 1.1s, boosting search ranking and mobile conversion rate by 18%.',
    },
    sampleAnswer: 'The Critical Rendering Path consists of 5 sequential stages: 1) HTML Parsing: The browser parses raw HTML bytes into tokens, then nodes, constructing the Document Object Model (DOM) tree. 2) CSS Parsing: Simultaneously, CSS rules are parsed into the CSS Object Model (CSSOM) tree. 3) Render Tree: The DOM and CSSOM are combined, filtering out non-visible elements (like <head> or elements with display: none). 4) Layout (Reflow): The browser calculates exact coordinates, widths, and heights for every visual element on the viewport. 5) Paint & Composite: Pixels are painted onto layers and composited onto the screen via the GPU. To optimize this, we eliminate render-blocking CSS/JS and prefer CSS transforms which only trigger GPU compositing without costly layout recalculation.',
    keyPoints: [
      'DOM + CSSOM combine into the Render Tree (omits display: none)',
      'Layout calculates box geometry and screen coordinates',
      'Paint converts vector shapes and text into raster bitmap pixels',
      'Transforms and Opacity trigger GPU compositing only, avoiding expensive reflows',
    ],
    codeSnippet: `<!-- Optimizing the critical rendering path -->
<link rel="preload" href="/fonts/outfit.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/critical.css">
<script src="/analytics.js" defer></script>`,
    tags: ['Frontend', 'Rendering', 'Performance', 'DOM'],
  },
  {
    id: 'fe-02',
    domain: 'frontend',
    difficulty: 'medium',
    title: 'React Rendering Cycle, Reconciliation & Fiber Architecture',
    question: 'How does React Fiber architecture work? How does reconciliation differ between Virtual DOM diffing and DOM commit phase?',
    introvertTip: 'You do not need to perform or be loud. Thoughtful, clear clarity: "Fiber turned reconciliation from a recursive, unpausable loop into an interruptible work scheduler."',
    starFramework: {
      situation: 'A large interactive data dashboard suffered severe input latency (INP > 350ms) during complex table re-renders.',
      task: 'Eliminate main-thread blocking without sacrificing data richness.',
      action: 'Leveraged React 18 useTransition and useDeferredValue to mark heavy chart updates as non-urgent transitions.',
      result: 'Kept typing responsive at 60fps, lowering INP from 350ms to 28ms.',
    },
    sampleAnswer: 'Before React 16, React used a recursive "Stack Reconciler". Once rendering started, it could not be paused, causing noticeable frame drops and sluggish input responsiveness during heavy DOM diffs. React Fiber redesigned this into a virtual stack frame architecture where every component is represented as a "Fiber node" in a linked-list work tree. This split rendering into two phases: 1) The Render Phase (asynchronous & interruptible): React diffs the old and new fiber trees, calculates minimal changes, and prioritizes work based on urgency (e.g., user typing has higher priority than background fetches). 2) The Commit Phase (synchronous): React applies calculated DOM mutations in one swift, unpausable batch. This enables concurrent features like Suspense, useTransition, and selective hydration.',
    keyPoints: [
      'Fiber represents work units as a mutable linked-list tree',
      'Render phase is interruptible and prioritizes urgent user inputs',
      'Commit phase applies DOM changes synchronously in a single batch',
      'Enables Concurrent React (useTransition, useDeferredValue, Suspense)',
    ],
    codeSnippet: `// Non-blocking Concurrent React with useTransition
import { useState, useTransition } from 'react';

function SearchInterface() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isPending, startTransition] = useTransition();

    const handleInput = (e) => {
        // High priority: typing remains instantaneous
        setQuery(e.target.value);

        // Low priority: deferred behind keystrokes
        startTransition(() => {
            const filtered = heavyDataFilter(e.target.value);
            setResults(filtered);
        });
    };
}`,
    tags: ['React', 'Fiber', 'Reconciliation', 'Performance'],
  },
  {
    id: 'fe-03',
    domain: 'frontend',
    difficulty: 'hard',
    title: 'Micro-Frontends & Module Federation Architecture',
    question: 'How does Webpack 5 / Vite Module Federation architect independent deployability in enterprise web apps? Address shared dependencies, state isolation, and CSS collision.',
    introvertTip: 'Stand tall in your technical depth. Speak about the business reality: allowing 8 different engineering teams to deploy independently without breaking each other.',
    starFramework: {
      situation: 'A monolithic frontend with 45 engineers took 35 minutes to build and a single bug blocked weekly company releases.',
      task: 'Deconstruct monolith into independently deployable micro-frontends.',
      action: 'Engineered a Module Federation host-remote architecture with shared singleton React instances and CSS modules scoping.',
      result: 'Build times dropped from 35 minutes to 90 seconds per squad, enabling 15+ independent daily production deployments.',
    },
    sampleAnswer: 'Micro-Frontends decompose a monolithic frontend into independent semi-autonomous applications developed and deployed by different teams. Module Federation enables a JavaScript application to dynamically load code from another independent build at runtime without bundle duplication. A "Host" app consumes "Remotes" via asynchronous chunk manifests. Crucially, Module Federation provides a "shared" configuration with singleton enforcement for core runtime libraries (like React and React-DOM), ensuring that multiple micro-apps do not instantiate duplicate React context trees. For state isolation, teams communicate via lightweight CustomEvent buses or URL query parameters rather than sharing mutable global stores. For styling, CSS Modules, Tailwind prefixed layers, or Shadow DOM boundaries prevent accidental global CSS leaks.',
    keyPoints: [
      'Module Federation dynamically loads external remote code chunks at runtime',
      'Shared dependency configuration guarantees singleton instances of React',
      'Decouples enterprise deployment pipelines across independent squads',
      'CSS isolation enforced via Tailwind prefixes, CSS Modules, or Shadow DOM',
    ],
    codeSnippet: `// Module Federation Configuration in Remote
// vite.config.ts / federationPlugin
federation({
    name: 'checkoutApp',
    filename: 'remoteEntry.js',
    exposes: {
        './CartWidget': './src/components/CartWidget.tsx',
    },
    shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
    },
});`,
    tags: ['Frontend', 'Micro-Frontends', 'Architecture', 'Module Federation'],
  },

  // =================== BEHAVIORAL & STAGE FEAR ===================
  {
    id: 'beh-01',
    domain: 'behavioral',
    difficulty: 'easy',
    title: 'Tell Me About Yourself (The Introvert Confidence Hook)',
    question: 'Walk me through your background and what excites you about this role.',
    introvertTip: 'Stage fear peak is in the first 60 seconds. Do NOT give your life story from childhood. Use the "Present -> Past -> Future" 90-second formula. Smile gently, take a slow breath, and speak.',
    starFramework: {
      situation: 'Interviewing for a competitive engineering position where small talk feels exhausting.',
      task: 'Deliver an engaging, authentic 90-second summary without rambling or freezing.',
      action: 'Followed Present-Past-Future: Current technical focus, 1 key past milestone, and why this specific problem space energizes you.',
      result: 'Set a warm, authoritative tone and immediately anchored the conversation on strengths.',
    },
    sampleAnswer: 'Certainly. Currently, I am a software engineer focused on building resilient backend services and clean APIs. Over the past three years, my primary focus has been optimizing data processing pipelines and architecting reliable distributed systems. Before that, I built foundational experience in full-stack web applications, where I learned the importance of clear communication between front-of-house interfaces and database layers. What excites me about your team is your work on high-scale distributed systems. As someone who thrives in deep-focus problem solving, I love dissecting complex architectural bottlenecks and turning messy requirements into elegant, reliable code.',
    keyPoints: [
      'Present: What you do right now and your technical focus (30s)',
      'Past: 1-2 concrete achievements or formative milestones (30s)',
      'Future: Why this specific team/role aligns with your passion (30s)',
      'Avoid rambling; pause cleanly when your 90 seconds are done',
    ],
    tags: ['Behavioral', 'Stage Fear', 'Elevator Pitch', 'Confidence'],
  },
  {
    id: 'beh-02',
    domain: 'behavioral',
    difficulty: 'medium',
    title: 'Handling Technical Disagreements as an Introvert',
    question: 'Tell me about a time when you disagreed with a colleague or tech lead on an architectural decision. How did you handle it?',
    introvertTip: 'Introverts often dislike confrontation. Frame your quiet nature as your greatest strength: you do not yell or get emotional; you bring data, prototypes, and respectful curiosity.',
    starFramework: {
      situation: 'Our tech lead proposed rolling our own bespoke authentication encryption algorithm, while I recommended industry-standard OAuth/JWT libraries.',
      task: 'Steer the architecture toward industry best practices without undermining the lead’s authority in front of the team.',
      action: 'Scheduled a 1-on-1 coffee chat, acknowledged their security goals, and presented a side-by-side CVE security comparison and maintenance cost analysis.',
      result: 'The lead enthusiastically agreed to adopt the verified library, saving an estimated 3 months of security auditing.',
    },
    sampleAnswer: 'In my previous team, our tech lead wanted to design a custom token encryption algorithm to secure user session states. While I admired their passion for deep security, I knew that in-house cryptographic algorithms carry immense security vulnerability risks compared to established standards like OAuth 2.0 with RS256. As an introvert, I prefer thoughtful, non-confrontational discussions over debating in the middle of a crowded standup. I invited the lead to a private 1-on-1, validated their intention to minimize token size, and presented a concise 1-page comparative analysis highlighting security audit requirements and maintenance overhead. By focusing objectively on long-term team velocity and verified security standards, we amicably agreed to adopt an industry-standard library, which passed our external penetration test with zero findings.',
    keyPoints: [
      'Take discussions to private 1-on-1s rather than public confrontation',
      'Focus on objective data, benchmarks, and security trade-offs, not personal opinions',
      'Validate the other person’s underlying goals first',
      'Conclude with the positive collaborative outcome',
    ],
    tags: ['Behavioral', 'Disagreements', 'Collaboration', 'STAR'],
  },
  {
    id: 'beh-03',
    domain: 'behavioral',
    difficulty: 'hard',
    title: 'Failure, Imposter Syndrome & High-Pressure Outages',
    question: 'Describe a significant mistake or failure in production that you were responsible for. How did you navigate the panic, resolve the issue, and what did you learn?',
    introvertTip: 'Vulnerability is magnetic. Anxious candidates try to hide mistakes. True senior engineers own failures with poise. Emphasize your calm incident triage and the blameless post-mortem.',
    starFramework: {
      situation: 'During a Friday release, an unindexed database migration locked the accounts table, causing a 14-minute customer checkout outage.',
      task: 'Manage the immediate panic, roll back the migration safely, and communicate with stakeholders.',
      action: 'Initiated the incident bridge, executed the tested rollback runbook, and authored a thorough blameless post-mortem with automated CI index checks.',
      result: 'Restored service in 14 minutes, introduced zero-downtime migration linters, and prevented similar outages across 12 other teams.',
    },
    sampleAnswer: 'Early in my career, I deployed a schema migration that added a foreign key constraint to our primary transaction table without the "CONCURRENTLY" flag. The table immediately took an exclusive write lock, queueing incoming customer orders and causing a 14-minute checkout outage. When alerts fired, my adrenaline spiked and I felt a wave of stage-panic. Instead of reacting impulsively, I took a deliberate deep breath to steady my focus, joined the incident command channel, and immediately owned the issue. I initiated our rollback script, verifying database connection drain before restarting traffic. Once stable, I led a blameless post-mortem. We realized our CI pipeline lacked automated checks for locking DDL statements. I authored a database migration linter that now automatically blocks dangerous locks in pull requests. That experience taught me that in high-stakes crises, staying calm and methodical is far more valuable than rushing, and that healthy engineering teams treat failures as systemic learning opportunities.',
    keyPoints: [
      'Take immediate, calm ownership without passing blame',
      'Follow disciplined triage procedures under high-stress conditions',
      'Lead a blameless post-mortem focused on systemic improvements',
      'Implement automated guardrails to ensure the mistake can never repeat',
    ],
    tags: ['Behavioral', 'Failures', 'Crisis Management', 'Growth Mindset'],
  },
];
