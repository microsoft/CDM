// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Concurrent
{
    using System.Collections.Concurrent;

    internal class ConcurrentSemaphore
    {
        /// <summary>
        /// Number of concurrent tasks allowed to run at the same time.
        /// </summary>
        public int? Permits 
        {
            get
            {
                return permits;
            }
            set
            {
                permits = value;
                if (permits != null)
                {
                    queue = new BlockingCollection<int>((int)permits);
                }
                else
                {
                    // If permits is null, it means that the queue is unbounded.
                    queue = new BlockingCollection<int>();
                }
            }
        }

        /// <summary>
        /// Queue of tasks waiting for a permit to be available.
        /// </summary>
        private BlockingCollection<int> queue;

        /// <summary>
        /// Number of concurrent tasks allowed to run at the same time.
        /// </summary>
        private int? permits;

        public ConcurrentSemaphore(int? permits = null)
        {
            this.Permits = permits;
        }

        /// <summary>
        /// Acquires a permit to keep the execution.
        /// </summary>
        public void Acquire() 
        {
            // Adds a number to occupy one position in the queue. 
            // If the queue gets full and another number is added,
            // the calling function will be blocked until a position is freeded up.
            queue.Add(1);
        }

        /// <summary>
        /// eleases a permit and allows other tasks to run.
        /// </summary>
        public void Release()
        {
            // Release a position in the queue.
            queue.Take();
        }
    }
}
